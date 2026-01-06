import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { adminDb } from '@/lib/firebase-admin'
import { ProjectDifficulty } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { projectIdea, userId } = await request.json()

    if (!projectIdea || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user to check plan and usage
    const userRef = adminDb.collection('users').doc(userId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = userDoc.data()
    const monthlyLimit = userData?.plan === 'pro' ? 50 : 3

    if (userData && userData.projectsUsedThisMonth >= monthlyLimit) {
      return NextResponse.json(
        { error: 'Monthly project limit reached. Please upgrade to continue.' },
        { status: 403 }
      )
    }

    // Generate project instructions using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert DIY project instructor. Given a project idea, create detailed, step-by-step instructions.

Format your response as a JSON object with this exact structure:
{
  "overview": "A brief overview of the project and what the user will build",
  "timeEstimate": "Estimated time to complete (e.g., '2-3 hours', '1 day', '1 weekend')",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "materials": [
    {"name": "Material name", "quantity": "Amount needed", "estimated_cost": "$X.XX"}
  ],
  "tools": [
    {"name": "Tool name", "optional": false}
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Detailed description of what to do",
      "tips": ["Helpful tip 1", "Helpful tip 2"],
      "warnings": ["Safety warning if applicable"]
    }
  ]
}

Be specific, clear, and include safety considerations where appropriate.`
        },
        {
          role: 'user',
          content: `Create detailed DIY instructions for: ${projectIdea}`
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const instructions = JSON.parse(content)

    // Create project document
    const projectRef = adminDb.collection('projects').doc()
    const projectData = {
      id: projectRef.id,
      userId,
      title: projectIdea,
      status: 'complete' as const,
      difficulty: instructions.difficulty as ProjectDifficulty,
      instructions,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await projectRef.set(projectData)

    // Increment user's project count
    await userRef.update({
      projectsUsedThisMonth: (userData?.projectsUsedThisMonth || 0) + 1
    })

    return NextResponse.json({
      success: true,
      project: projectData
    })

  } catch (error) {
    console.error('Project generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate project instructions' },
      { status: 500 }
    )
  }
}
