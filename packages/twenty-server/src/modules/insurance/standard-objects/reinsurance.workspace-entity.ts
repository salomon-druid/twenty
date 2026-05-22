import {
  type ActorMetadata,
  type CurrencyMetadata,
  FieldMetadataType,
} from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type PolicyWorkspaceEntity } from 'src/modules/insurance/standard-objects/policy.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type BrokerWorkspaceEntity } from 'src/modules/insurance/standard-objects/broker.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

const NAME_FIELD_NAME = 'treatyNumber';

export const SEARCH_FIELDS_FOR_REINSURANCE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class ReinsuranceWorkspaceEntity extends BaseWorkspaceEntity {
  treatyNumber: string;
  type: string;
  reinsurer: string;
  cededPercentage: number | null;
  cededAmount: CurrencyMetadata | null;
  commission: number | null;
  validFrom: Date | null;
  validTo: Date | null;
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  policy: EntityRelation<PolicyWorkspaceEntity> | null;
  policyId: string | null;
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
