declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"basics/javascript/connect.mdx": {
	id: "basics/javascript/connect.mdx";
  slug: "basics/javascript/connect";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"basics/javascript/create-wallet.mdx": {
	id: "basics/javascript/create-wallet.mdx";
  slug: "basics/javascript/create-wallet";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"basics/javascript/faucet.mdx": {
	id: "basics/javascript/faucet.mdx";
  slug: "basics/javascript/faucet";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"basics/javascript/index.mdx": {
	id: "basics/javascript/index.mdx";
  slug: "basics/javascript";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"basics/javascript/send.mdx": {
	id: "basics/javascript/send.mdx";
  slug: "basics/javascript/send";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"basics/javascript/started.mdx": {
	id: "basics/javascript/started.mdx";
  slug: "basics/javascript/started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/check-account-lines.mdx": {
	id: "beginners/javascript/check-account-lines.mdx";
  slug: "beginners/javascript/check-account-lines";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/check-account.mdx": {
	id: "beginners/javascript/check-account.mdx";
  slug: "beginners/javascript/check-account";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/disable-noripple.mdx": {
	id: "beginners/javascript/disable-noripple.mdx";
  slug: "beginners/javascript/disable-noripple";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/enabled-rippling.mdx": {
	id: "beginners/javascript/enabled-rippling.mdx";
  slug: "beginners/javascript/enabled-rippling";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/failure-payment-2.mdx": {
	id: "beginners/javascript/failure-payment-2.mdx";
  slug: "beginners/javascript/failure-payment-2";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/failure-payment.mdx": {
	id: "beginners/javascript/failure-payment.mdx";
  slug: "beginners/javascript/failure-payment";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/index.mdx": {
	id: "beginners/javascript/index.mdx";
  slug: "beginners/javascript";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/payment-token.mdx": {
	id: "beginners/javascript/payment-token.mdx";
  slug: "beginners/javascript/payment-token";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/success-payment.mdx": {
	id: "beginners/javascript/success-payment.mdx";
  slug: "beginners/javascript/success-payment";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/trustline.mdx": {
	id: "beginners/javascript/trustline.mdx";
  slug: "beginners/javascript/trustline";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"beginners/javascript/trustset-bob.mdx": {
	id: "beginners/javascript/trustset-bob.mdx";
  slug: "beginners/javascript/trustset-bob";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"editor/install.mdx": {
	id: "editor/install.mdx";
  slug: "editor/install";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"editor/prettier.mdx": {
	id: "editor/prettier.mdx";
  slug: "editor/prettier";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/basics/javascript/connect.mdx": {
	id: "en/basics/javascript/connect.mdx";
  slug: "en/basics/javascript/connect";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/basics/javascript/create-wallet.mdx": {
	id: "en/basics/javascript/create-wallet.mdx";
  slug: "en/basics/javascript/create-wallet";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/basics/javascript/faucet.mdx": {
	id: "en/basics/javascript/faucet.mdx";
  slug: "en/basics/javascript/faucet";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/basics/javascript/index.mdx": {
	id: "en/basics/javascript/index.mdx";
  slug: "en/basics/javascript";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/basics/javascript/send.mdx": {
	id: "en/basics/javascript/send.mdx";
  slug: "en/basics/javascript/send";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/basics/javascript/started.mdx": {
	id: "en/basics/javascript/started.mdx";
  slug: "en/basics/javascript/started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/check-account-lines.mdx": {
	id: "en/beginners/javascript/check-account-lines.mdx";
  slug: "en/beginners/javascript/check-account-lines";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/check-account.mdx": {
	id: "en/beginners/javascript/check-account.mdx";
  slug: "en/beginners/javascript/check-account";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/disable-noripple.mdx": {
	id: "en/beginners/javascript/disable-noripple.mdx";
  slug: "en/beginners/javascript/disable-noripple";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/enabled-rippling.mdx": {
	id: "en/beginners/javascript/enabled-rippling.mdx";
  slug: "en/beginners/javascript/enabled-rippling";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/failure-payment-2.mdx": {
	id: "en/beginners/javascript/failure-payment-2.mdx";
  slug: "en/beginners/javascript/failure-payment-2";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/failure-payment.mdx": {
	id: "en/beginners/javascript/failure-payment.mdx";
  slug: "en/beginners/javascript/failure-payment";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/index.mdx": {
	id: "en/beginners/javascript/index.mdx";
  slug: "en/beginners/javascript";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/payment-token.mdx": {
	id: "en/beginners/javascript/payment-token.mdx";
  slug: "en/beginners/javascript/payment-token";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/success-payment.mdx": {
	id: "en/beginners/javascript/success-payment.mdx";
  slug: "en/beginners/javascript/success-payment";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/trustline.mdx": {
	id: "en/beginners/javascript/trustline.mdx";
  slug: "en/beginners/javascript/trustline";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/beginners/javascript/trustset-bob.mdx": {
	id: "en/beginners/javascript/trustset-bob.mdx";
  slug: "en/beginners/javascript/trustset-bob";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/editor/install.mdx": {
	id: "en/editor/install.mdx";
  slug: "en/editor/install";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/editor/prettier.mdx": {
	id: "en/editor/prettier.mdx";
  slug: "en/editor/prettier";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/getting-started/index.mdx": {
	id: "en/getting-started/index.mdx";
  slug: "en/getting-started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/getting-started/node-js.mdx": {
	id: "en/getting-started/node-js.mdx";
  slug: "en/getting-started/node-js";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/index.mdx": {
	id: "en/index.mdx";
  slug: "en";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/xrpl/ecosystem.mdx": {
	id: "en/xrpl/ecosystem.mdx";
  slug: "en/xrpl/ecosystem";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/xrpl/features.mdx": {
	id: "en/xrpl/features.mdx";
  slug: "en/xrpl/features";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"en/xrpl/whats.mdx": {
	id: "en/xrpl/whats.mdx";
  slug: "en/xrpl/whats";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"getting-started/index.mdx": {
	id: "getting-started/index.mdx";
  slug: "getting-started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"getting-started/node-js.mdx": {
	id: "getting-started/node-js.mdx";
  slug: "getting-started/node-js";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"xrpl/ecosystem.mdx": {
	id: "xrpl/ecosystem.mdx";
  slug: "xrpl/ecosystem";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"xrpl/features.mdx": {
	id: "xrpl/features.mdx";
  slug: "xrpl/features";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"xrpl/whats.mdx": {
	id: "xrpl/whats.mdx";
  slug: "xrpl/whats";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
