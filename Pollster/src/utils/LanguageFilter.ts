import { Filter } from "bad-words";

const filter = new Filter();

export function hasProfaneLanguage(text: string) {
    return filter.isProfane(text);
}