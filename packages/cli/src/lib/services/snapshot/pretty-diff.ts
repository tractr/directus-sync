import type { Field, FieldMeta } from '@directus/types';
import type { Diff } from 'deep-diff';
import chalk from 'chalk';

// -------------------------------------------------------------------------------------------------
// TODO: Remove this once the types are updated in the Directus SDK
type SnapshotField = Field & { meta: Omit<FieldMeta, 'id'> };
const DiffKind = {
	/** indicates a newly added property/element */
	NEW: 'N',
	/** indicates a property/element was deleted */
	DELETE: 'D',
	/** indicates a property/element was edited */
	EDIT: 'E',
	/** indicates a change occurred within an array */
	ARRAY: 'A',
} as const;
export type SnapshotDiff = {
    /** eslint-disable-next-line @typescript-eslint/no-explicit-any */
    collections: Record<string, any>[];
    /** eslint-disable-next-line @typescript-eslint/no-explicit-any */
    fields: Record<string, any>[];
    /** eslint-disable-next-line @typescript-eslint/no-explicit-any */
    relations: Record<string, any>[];
};
// -------------------------------------------------------------------------------------------------


/**
 * Pretty print the diff using the same format as Directus CLI:
 * https://github.com/directus/directus/blob/main/api/src/cli/commands/schema/apply.ts#L84-L168
 */
export function getDiffMessage(snapshotDiff: SnapshotDiff) {

    const sections = [];

    if (snapshotDiff.collections.length > 0) {
        const lines = [chalk.underline.bold('Collections:')];

        for (const { collection, diff } of snapshotDiff.collections) {
            if (diff[0]?.kind === DiffKind.EDIT) {
                lines.push(`  - ${chalk.magenta('Update')} ${collection}`);

                for (const change of diff) {
                    if (change.kind === DiffKind.EDIT) {
                        const path = formatPath(change.path!);
                        lines.push(`    - Set ${path} to ${change.rhs}`);
                    }
                }
            } else if (diff[0]?.kind === DiffKind.DELETE) {
                lines.push(`  - ${chalk.red('Delete')} ${collection}`);
            } else if (diff[0]?.kind === DiffKind.NEW) {
                lines.push(`  - ${chalk.green('Create')} ${collection}`);
            } else if (diff[0]?.kind === DiffKind.ARRAY) {
                lines.push(`  - ${chalk.magenta('Update')} ${collection}`);
            }
        }

        sections.push(lines.join('\n'));
    }

    if (snapshotDiff.fields.length > 0) {
        const lines = [chalk.underline.bold('Fields:')];

        for (const { collection, field, diff } of snapshotDiff.fields) {
            if (diff[0]?.kind === DiffKind.EDIT || isNestedMetaUpdate(diff[0]!)) {
                lines.push(`  - ${chalk.magenta('Update')} ${collection}.${field}`);

                for (const change of diff) {
                    const path = formatPath(change.path!);

                    if (change.kind === DiffKind.EDIT) {
                        lines.push(`    - Set ${path} to ${change.rhs}`);
                    } else if (change.kind === DiffKind.DELETE) {
                        lines.push(`    - Remove ${path}`);
                    } else if (change.kind === DiffKind.NEW) {
                        lines.push(`    - Add ${path} and set it to ${change.rhs}`);
                    }
                }
            } else if (diff[0]?.kind === DiffKind.DELETE) {
                lines.push(`  - ${chalk.red('Delete')} ${collection}.${field}`);
            } else if (diff[0]?.kind === DiffKind.NEW) {
                lines.push(`  - ${chalk.green('Create')} ${collection}.${field}`);
            } else if (diff[0]?.kind === DiffKind.ARRAY) {
                lines.push(`  - ${chalk.magenta('Update')} ${collection}.${field}`);
            }
        }

        sections.push(lines.join('\n'));
    }

    if (snapshotDiff.relations.length > 0) {
        const lines = [chalk.underline.bold('Relations:')];

        for (const { collection, field, related_collection, diff } of snapshotDiff.relations) {
            const relatedCollection = formatRelatedCollection(related_collection);

            if (diff[0]?.kind === DiffKind.EDIT) {
                lines.push(`  - ${chalk.magenta('Update')} ${collection}.${field}${relatedCollection}`);

                for (const change of diff) {
                    if (change.kind === DiffKind.EDIT) {
                        const path = formatPath(change.path!);
                        lines.push(`    - Set ${path} to ${change.rhs}`);
                    }
                }
            } else if (diff[0]?.kind === DiffKind.DELETE) {
                lines.push(`  - ${chalk.red('Delete')} ${collection}.${field}${relatedCollection}`);
            } else if (diff[0]?.kind === DiffKind.NEW) {
                lines.push(`  - ${chalk.green('Create')} ${collection}.${field}${relatedCollection}`);
            } else if (diff[0]?.kind === DiffKind.ARRAY) {
                lines.push(`  - ${chalk.magenta('Update')} ${collection}.${field}${relatedCollection}`);
            }
        }

        sections.push(lines.join('\n'));
    }

    const message = 'The following changes will be applied:\n\n' + sections.join('\n\n') + '\n';

    return message;
}


function formatPath(path: string[]): string {
	if (path.length === 1) {
		return path.toString();
	}

	return path.slice(1).join('.');
}

function formatRelatedCollection(relatedCollection: string | null): string {
	// Related collection doesn't exist for a2o relationship types
	if (relatedCollection) {
		return ` → ${relatedCollection}`;
	}

	return '';
}

function isNestedMetaUpdate(diff: Diff<SnapshotField | undefined>): boolean {
	if (!diff) return false;
	if (diff.kind !== DiffKind.NEW && diff.kind !== DiffKind.DELETE) return false;
	if (!diff.path || diff.path.length < 2 || diff.path[0] !== 'meta') return false;
	return true;
}