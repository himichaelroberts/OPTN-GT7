import { Passage } from '@passageidentity/passage-js';

const getClientWithEnvCheck = () => {
  if (
    !process.env.NEXT_PUBLIC_PASSAGE_APP_ID
  ) {
    throw new Error(
      'NEXT_PUBLIC_PASSAGE_APP_ID env variables is missing'
    );
  }

  // window.navigator = {};

  // return new Passage(process.env.NEXT_PUBLIC_PASSAGE_APP_ID);
};

export const passageClient = getClientWithEnvCheck();
