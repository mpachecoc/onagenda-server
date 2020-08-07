import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import ImailProvider from './models/ImailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<ImailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
