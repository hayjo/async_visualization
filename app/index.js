import { runParallel, runWaterfall, runSeries, runRace } from './lib/runFlows';

const flows = {
  $parallel: document.querySelector('.parallel > .task-holder'),
  $waterfall: document.querySelector('.waterfall > .task-holder'),
  $series: document.querySelector('.series > .task-holder'),
  $race: document.querySelector('.race > .task-holder'),
};

runParallel(flows.$parallel);
runWaterfall(flows.$waterfall);
runSeries(flows.$series);
runRace(flows.$race);
