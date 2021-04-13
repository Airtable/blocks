import {UserError} from './error_utils';

export type SelectMessage<T extends {type: string}, Name extends T['type']> = T extends {type: Name}
    ? T
    : never;

export type MessageCalls<MessageInfo extends {type: string}, MessageUtil = void> = {
    [key in MessageInfo['type']]: (
        this: Messages<MessageInfo, MessageUtil>,
        info: SelectMessage<MessageInfo, key>,
    ) => string;
};

export type Messages<MessageInfo extends {type: string}, MessageUtil = void> = {
    util: MessageUtil;
    renderMessage(message: MessageInfo): string;
    renderError(err: UserError<MessageInfo>): string;
    supportsMessage<Info extends MessageInfo = MessageInfo>(message: unknown): message is Info;
    supportsError<Info extends MessageInfo = MessageInfo>(err: Error): err is UserError<Info>;
} & MessageCalls<MessageInfo>;

export interface MessageConstructor<MessageInfo extends {type: string}, MessageUtil = void> {
    new (util: MessageUtil): Messages<MessageInfo>;
}

export class RenderMessage<MessageInfo extends {type: string}, MessageUtil = void> {
    util: MessageUtil;

    constructor(util: MessageUtil) {
        this.util = util;
    }

    renderMessage(message: MessageInfo): string {
        return (this as any)[message.type](message);
    }
    renderError(err: UserError<MessageInfo>): string {
        return this.renderMessage(err.__userInfo);
    }
    supportsMessage(message: unknown): message is MessageInfo {
        return (
            typeof message === 'object' &&
            message !== null &&
            'type' in message &&
            (message as MessageInfo).type in this
        );
    }
    supportsError(err: Error & {__userInfo?: unknown}): err is UserError<MessageInfo> {
        return this.supportsMessage(err.__userInfo);
    }
    static extend<ExtendMessageInfo extends {type: string}, ExtendMessageUtil = void>(
        methods: MessageCalls<ExtendMessageInfo, ExtendMessageUtil>,
    ): MessageConstructor<ExtendMessageInfo, ExtendMessageUtil> {
        const ExtendedFormatMessage = class ExtendedFormatMessage extends RenderMessage<
            ExtendMessageInfo,
            ExtendMessageUtil
        > {};
        Object.assign(ExtendedFormatMessage.prototype, methods);
        return ExtendedFormatMessage as any;
    }
}
