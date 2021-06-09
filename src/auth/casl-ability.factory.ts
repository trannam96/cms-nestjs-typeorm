import { Injectable } from '@nestjs/common';

import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { User } from '../entities/user';
import { Action, Roles } from '../common/enum';
import { PostEntity } from '../entities/post';

type Subjects = InferSubjects<typeof PostEntity | typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    if (user.role === Roles.MANAGER) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    can(Action.Update, PostEntity, { createdBy: user });
    can(Action.Delete, PostEntity, { createdBy: user });
    can(Action.Update, User, { id: user.id });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
