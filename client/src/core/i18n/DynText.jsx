import { useDynamicTranslation } from "./useDynamicTranslation";

export default function DynText({ text, persistent = true }) {
    const translated = useDynamicTranslation(text, persistent);
    return translated || text;
}
