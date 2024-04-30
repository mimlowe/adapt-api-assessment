import { IAgent, IParsedField } from '../../interface';

export class Agent implements IAgent {
  public agencyCode: string = '';
  public agencyName: string = '';
  public name: string = '';
  public producerCode: string = '';

  public static withParsedFields(fields: IParsedField[]): Agent {
    const agent: Agent = new Agent();

    for (const key of Object.keys(agent) as (keyof IAgent)[]) {
      const field: IParsedField | undefined = fields.find(
        (el: IParsedField): boolean => el.fieldName === key,
      );
      if (field && field.value) {
        agent[key] = field.value;
      }
    }
    return agent;
  }

  public toObject(): IAgent {
    return {
      agencyCode: this.agencyCode,
      agencyName: this.agencyName,
      name: this.name,
      producerCode: this.producerCode,
    } as IAgent;
  }
}
