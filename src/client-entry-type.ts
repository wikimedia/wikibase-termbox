// This file only exists to export types that may be useful to consumers without
// exporting interfaces from client-entry.ts itself.

export { default } from './client-entry';
export { default as EntityRepository } from '@/common/data-access/EntityRepository';
export { default as WritingEntityRepository } from '@/common/data-access/WritingEntityRepository';
export { default as TechnicalProblem } from '@/common/data-access/error/TechnicalProblem';
