import { Carriers } from '../enum';
import {
  IAgent,
  ICarrierTemplate,
  ICustomer,
  IParsedField,
  IPolicy,
} from '../interface';
import { Agent, Customer, Policy } from '../scraper';

/**
 * CarrierTemplate contains the information necessary for the following:
 *
 * 1. CarrierPageLoader to load each page of carrier data.
 * 2. CarrierPageParser to select the elements which contain data for each field.
 * 3. CarrierDataFormatter to instantiate the correct data object and format the fields.
 */

export const CarrierTemplate: {
  MOCK_INDEMNITY: ICarrierTemplate;
  PLACEHOLDER_CARRIER: ICarrierTemplate;
} = {
  [Carriers.MOCK_INDEMNITY]: {
    baseUrl: 'https://scraping-interview.onrender.com',
    schemaKeys: ['agent', 'customer', 'policies'],
    agent: {
      url: '/mock_indemnity/:id',
      isPaginated: false,
      formatter: (parsedFields: IParsedField[]): IAgent => {
        return Agent.withParsedFields(parsedFields).toObject();
      },
      root: { element: 'div', select: '.agent-detail' },
      dataFields: {
        name: { element: 'dd', select: '.value-name' },
        producerCode: { element: 'dd', select: '.value-producerCode' },
        agencyName: { element: 'dd', select: '.value-agencyName' },
        agencyCode: { element: 'dd', select: '.value-agencyCode' },
      },
    },
    customer: {
      url: '/mock_indemnity/:id',
      isPaginated: false,
      formatter: (parsedFields: IParsedField[]): ICustomer => {
        return Customer.withParsedFields(parsedFields).toObject();
      },
      root: { element: 'div', select: '.customer-detail' },
      dataFields: {
        name: { element: 'dd', select: '.value-name' },
        id: { element: 'dd', select: '.value-id' },
        email: { element: 'dd', select: '.value-email' },
        address: { element: 'dd', select: '.value-address' },
      },
    },
    policies: {
      url: '/mock_indemnity/:id',
      isPaginated: false,
      formatter: (parsedFields: IParsedField[]): IPolicy => {
        return Policy.withParsedFields(parsedFields).toObject();
      },
      root: { element: 'ul', select: '.policy-ul' },
      item: { element: 'li', select: '.list-group-item' },
      dataFields: {
        id: { element: 'li', select: '.id' },
        premium: { element: 'li', select: '.premium' },
        status: { element: 'li', select: '.status' },
        effectiveDate: { element: 'li', select: '.effectiveDate' },
        terminationDate: { element: 'li', select: '.terminationDate' },
        lastPaymentDate: { element: 'li', select: '.lastPaymentDate' },
      },
    },
  },
  [Carriers.PLACEHOLDER_CARRIER]: {
    baseUrl: 'https://scraping-interview.onrender.com',
    schemaKeys: ['agent', 'customer', 'policies'],
    agent: {
      formatter: (parsedFields: IParsedField[]): IAgent => {
        return Agent.withParsedFields(parsedFields).toObject();
      },
      url: '/placeholder_carrier/:id/policies/1',
      isPaginated: false,
      root: { element: 'div', select: '.agency-details' },
      dataFields: {
        name: { element: 'span', select: '[for=name]+' },
        producerCode: { element: 'span', select: '[for=producerCode]+' },
        agencyName: { element: 'span', select: '[for=agencyName]+' },
        agencyCode: { element: 'span', select: '[for=agencyCode]+' },
      },
    },
    customer: {
      url: '/placeholder_carrier/:id/policies/1',
      isPaginated: false,
      formatter: (parsedFields: IParsedField[]): ICustomer => {
        return Customer.withParsedFields(parsedFields).toObject();
      },
      root: { element: 'div', select: '.customer-details' },
      dataFields: {
        name: { element: 'span', select: '[for=name]+' },
        id: { element: 'span', select: 'label:contains("Id")+' },
        email: {
          element: 'span',
          select: 'label:contains("Email") <',
          deepExtract: (val: string) => {
            const start: string = 'Email:</label>';
            const end: string = '<div>Address:';
            return val.substring(
              val.indexOf(start) + start.length,
              val.indexOf(end),
            );
          },
        },
        address: {
          element: 'span',
          select: 'div:contains("Address:")',
          deepExtract: (val: string) => {
            const start: string = 'Address: ';
            const end: string = '</div>';
            return val.substring(
              val.indexOf(start) + start.length,
              val.lastIndexOf(end),
            );
          },
        },
      },
    },
    policies: {
      url: '/placeholder_carrier/:id/policies/1',
      isPaginated: true,
      formatter: (parsedFields: IParsedField[]): IPolicy => {
        return Policy.withParsedFields(parsedFields).toObject();
      },
      page: { element: 'a', select: 'a:contains("Next")' },
      root: { element: 'div', select: '.policy-details' },
      item: { element: 'tr', select: 'table > tbody > tr:not(.collapse) ' },
      dataFields: {
        id: { element: 'td', select: ':nth-child(1)' },
        premium: { element: 'td', select: ':nth-child(2)' },
        status: { element: 'td', select: ':nth-child(3)' },
        effectiveDate: { element: 'td', select: ':nth-child(4)' },
        terminationDate: { element: 'td', select: ':nth-child(5)' },
        lastPaymentDate: {
          element: 'td',
          select: '+',
          deepExtract: (val: string) => {
            const start: string = 'Last Payment Date: ';
            const end: string = '<br>';
            return val.substring(
              val.indexOf(start) + start.length,
              val.indexOf(end),
            );
          },
        },
        commissionRate: {
          element: 'td',
          select: '+',
          deepExtract: (val: string) => {
            const start: string = 'Commission Rate: ';
            const end: string = '%';
            return val.substring(
              val.indexOf(start) + start.length,
              val.indexOf(end) + 1,
            );
          },
        },
        numberInsured: {
          element: 'td',
          select: '+',
          deepExtract: (val: string) => {
            const start: string = 'Number of Insureds: ';
            const end: string = '</div>';
            return val.substring(
              val.indexOf(start) + start.length,
              val.lastIndexOf(end),
            );
          },
        },
      },
    },
  },
};
