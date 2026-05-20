import {
  type ActorMetadata,
  FieldMetadataType,
} from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type PolicyWorkspaceEntity } from 'src/modules/insurance/standard-objects/policy.workspace-entity';
import { type ClaimWorkspaceEntity } from 'src/modules/insurance/standard-objects/claim.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type BrokerWorkspaceEntity } from 'src/modules/insurance/standard-objects/broker.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

const NAME_FIELD_NAME = 'title';

export const SEARCH_FIELDS_FOR_TASK: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class InsuranceTaskWorkspaceEntity extends BaseWorkspaceEntity {
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: string;
  status: string;
  type: string;
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  assignedTo: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  assignedToId: string | null;
  policy: EntityRelation<PolicyWorkspaceEntity> | null;
  policyId: string | null;
  claim: EntityRelation<ClaimWorkspaceEntity> | null;
  claimId: string | null;
  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
  owner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  ownerId: string | null;
  broker: EntityRelation<BrokerWorkspaceEntity> | null;
  brokerId: string | null;
  searchVector: string;
}
