import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppAbility, CaslAbilityFactory } from '../casl-ability.factory';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_AUTH_PERMISSION_KEY = 'AUTH_PERMISSION';
export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_AUTH_PERMISSION_KEY, handlers);

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_AUTH_PERMISSION_KEY, context.getHandler()) || [];

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();

    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
