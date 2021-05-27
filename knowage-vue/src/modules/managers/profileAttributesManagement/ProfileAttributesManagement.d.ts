export interface iAttribute {
    attributeId: number | null;
    attributeName: string;
    attributeDescription: string | null;
    allowUser: number | null;
    multivalue: number | null;
    syntax: number | null;
    lovId: number | null;
    value: Object | {};
}

export interface iLov {
    id: number | null;
    name: string;
    description: string | null;
    label: string | null;
    lovProvider: JSON | null;
    lovProvider: string | null;
    itypeCd: string | null;
    itypeId: string | null;
    lovProviderJSON: JSON | null;
}