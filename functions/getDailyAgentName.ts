import { createClientFromRequest } from 'npm:@base44/sdk@0.5.0';

const agentNames = [
    'Emma', 'Oliver', 'Sophia', 'James', 'Isabella', 'William', 'Ava', 'Benjamin',
    'Mia', 'Lucas', 'Charlotte', 'Henry', 'Amelia', 'Alexander', 'Harper', 'Michael',
    'Evelyn', 'Ethan', 'Abigail', 'Daniel', 'Emily', 'Matthew', 'Elizabeth', 'Aiden',
    'Mila', 'Jackson', 'Ella', 'Samuel', 'Avery', 'David', 'Sofia', 'Joseph',
    'Camila', 'Carter', 'Aria', 'Owen', 'Scarlett', 'Wyatt', 'Victoria', 'John'
];

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Get today's date and use it to select a consistent name for the day
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const nameIndex = dayOfYear % agentNames.length;
        const selectedName = agentNames[nameIndex];

        return new Response(JSON.stringify({
            success: true,
            name: selectedName,
            date: today.toISOString().split('T')[0]
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            name: 'Assistant' // Fallback name
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
});