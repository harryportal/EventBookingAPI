export default interface MailInterface {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}