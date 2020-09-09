import {configuration as actionsConfiguration} from './helpers/actions';
import {configuration as calculationsConfiguration} from './helpers/utils/calculations';

import fs from 'fs';
import BigNumber from 'bignumber.js';
import {makeSuite} from './helpers/make-suite';
import {getReservesConfigByPool} from '../helpers/constants';
import {AavePools, iAavePoolAssets, IReserveParams} from '../helpers/types';
import {executeStory} from './helpers/scenario-engine';

BigNumber.config({DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_DOWN});

const scenarioFolder = './test/helpers/scenarios/';

const selectedScenarios: string[] = ['interest-redirection.json'];

fs.readdirSync(scenarioFolder).forEach((file) => {
  if (selectedScenarios.length > 0 && !selectedScenarios.includes(file)) return;

  const scenario = require(`./helpers/scenarios/${file}`);

  makeSuite(scenario.title, async (testEnv) => {
    before('Initializing configuration', async () => {
      actionsConfiguration.skipIntegrityCheck = false; //set this to true to execute solidity-coverage

      calculationsConfiguration.reservesParams = <iAavePoolAssets<IReserveParams>>(
        getReservesConfigByPool(AavePools.proto)
      );
    });

    for (const story of scenario.stories) {
      it(story.description, async () => {
        await executeStory(story, testEnv);
      });
    }
  });
});
