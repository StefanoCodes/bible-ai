import { data, type ActionFunctionArgs } from "react-router"
import { handleDeleteGeneration, handleSimplifyBibleStory, handleSimplifyBibleVerse } from "~/lib/actions/generations.server"


const intents = ['simplify-bible-story', 'simplify-bible-verse', "delete-generation"]

export async function loader() {
    return data('Not Allowed', { status: 405 })
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const intent = formData.get('intent') as string

    if (!intent || !intents.includes(intent)) {
        return data({ success: false, message: 'Invalid form submission' }, { status: 400 })
    }
    try {

        const handlers = {
            'simplify-bible-story': handleSimplifyBibleStory,
            'simplify-bible-verse': handleSimplifyBibleVerse,
            "delete-generation": handleDeleteGeneration,
        } as const

        const handler = handlers[intent as keyof typeof handlers]
        return handler(request, formData)
    } catch (error) {
        console.error('Action error:', error)
        return data({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}
