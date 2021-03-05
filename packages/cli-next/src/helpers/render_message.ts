export type SelectMessage<T extends {type: string}, Name extends T['type']> = T extends {type: Name}
    ? T
    : never;

export type MessageCalls<MessageInfo extends {type: string}> = {
    [key in MessageInfo['type']]: (
        this: Messages<MessageInfo>,
        info: SelectMessage<MessageInfo, key>,
    ) => string;
};

export type Messages<MessageInfo extends {type: string}> = {
    renderMessage(message: MessageInfo): string;
} & MessageCalls<MessageInfo>;

export interface MessageConstructor<MessageInfo extends {type: string}> {
    new (): Messages<MessageInfo>;
}

export class RenderMessage {
    renderMessage<MessageInfo extends {type: string}>(message: MessageInfo): string {
        if (typeof message?.type === 'string' && message.type in this) {
            return (this as any)[message.type](message);
        }
        return JSON.stringify(message);
    }
    static extend<MessageInfo extends {type: string}>(
        methods: MessageCalls<MessageInfo>,
    ): MessageConstructor<MessageInfo> {
        const ExtendedFormatMessage = class ExtendedFormatMessage extends RenderMessage {};
        Object.assign(ExtendedFormatMessage.prototype, methods);
        return ExtendedFormatMessage as any;
    }
}
