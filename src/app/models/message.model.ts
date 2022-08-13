export type Message = {
    type: 'incoming' | 'outgoing',
    payload: string | WitMessage
}

export type WitMessage = {
    text: string,
    intents: ReadonlyArray<WitIntent>,
    entities: WitEntity
}

export type WitIntent = {
    id: string,
    name: string,
    confidence: number
}

export type WitEntity = {
    [key: string]: [{
        id: string,
        name: string,
        role: string,
        start: number,
        end: number,
        body: string,
        confidence: number,
        entities: any,
        type: 'value' | 'interval',
        grain?: string,
        from?: any,
        to?: any,
        unit?: string,
        value: string,
        values?: any,
        traits?: any
    }]
}