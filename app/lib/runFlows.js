import { waterfall, parallel, series, race } from 'async';
import { colors, setDefault, doTask, generateRandomInt, doTaskWithArguments, makeArgumentHolder } from './handleTasks';

export function runParallel(parallelHolder) {
  const { FINAL_MESSAGE, taskElements, taskHolder, finalCallback, finalCallbackHolder } = setDefault(parallelHolder);
  const tasks = taskElements.map((element) => {
    return (callback) => doTask({
      element,
      color: colors.task,
      delay: generateRandomInt(),
      callback,
    });
  });

  waterfall(
    [
      function doTasks(callback) {
        parallel(tasks, callback);
      },
      function highlightTaskHolder(_, callback) {
        doTask({
          element: taskHolder,
          color: colors.argsHolder,
          delay: 500,
          callback,
        });
      },
      function moveTasksToFinalCallback(_, callback) {
        finalCallbackHolder.appendChild(taskHolder);
        callback(null);
      },
      function doFinalTask(callback) {
        doTaskWithArguments({
          element: finalCallback,
          holder: finalCallbackHolder,
          callback,
        });
      }
    ],
    function showFinalMessage() {
      console.log(FINAL_MESSAGE);
    }
  );
}

export function runSeries(seriesHolder) {
  const { FINAL_MESSAGE, taskElements, taskHolder, finalCallback, finalCallbackHolder } = setDefault(seriesHolder);
  const tasks = taskElements.map((element) => {
    return (callback) => doTask({
      element,
      color: colors.task,
      delay: generateRandomInt(300, 600),
      callback,
    });
  });

  waterfall(
    [
      function doTasks(callback) {
        series(tasks, callback);
      },
      function moveTasksToFinalCallback(_, callback) {
        finalCallbackHolder.appendChild(taskHolder);
        callback(null);
      },
      function highlightTaskHolder(callback) {
        doTask({
          element: taskHolder,
          color: colors.argsHolder,
          delay: 500,
          callback,
        });
      },
      function doFinalTask(_, callback) {
        doTaskWithArguments({
          element: finalCallback,
          holder: finalCallbackHolder,
          callback,
        });
      }
    ],
    function showFinalMessage(_) {
      console.log(FINAL_MESSAGE);
    }
  );
}

export function runWaterfall(waterfallHolder) {
  const { FINAL_MESSAGE, taskElements, taskHolder, finalCallback, finalCallbackHolder } = setDefault(waterfallHolder);
  const tasks = taskElements.map((element) => {
    return (first, second) => {
      if (typeof first === "function") {
        doTask({
          element,
          color: colors.task,
          delay: generateRandomInt(),
          callback: first,
        });
        return;
      }

      const elementHolder = makeArgumentHolder(element);
      elementHolder.appendChild(first);
      taskHolder.appendChild(elementHolder);
      doTaskWithArguments({ element, holder: elementHolder, callback: second });
    };
  });

  waterfall(
    [
      function doTasks(callback) {
        waterfall(tasks, callback);
      },
      function moveTasksToFinalCallback(_, callback) {
        finalCallbackHolder.appendChild(taskHolder);
        callback(null);
      },
      function highlightTaskHolder(callback) {
        doTask({
          element: taskHolder,
          color: colors.argsHolder,
          delay: 500,
          callback,
        });
      },
      function doFinalTask(_, callback) {
        doTaskWithArguments({
          element: finalCallback,
          holder: finalCallbackHolder,
          callback,
        });
      }
    ],
    function showFinalMessage() {
      console.log(FINAL_MESSAGE);
    }
  );
}

export function runRace(raceHolder) {
  const { FINAL_MESSAGE, taskElements, finalCallback, finalCallbackHolder } = setDefault(raceHolder);
  const tasks = taskElements.map((element) => {
    return (callback) => doTask({
      element,
      color: colors.task,
      delay: generateRandomInt(500, 4000),
      callback,
    });
  });

  waterfall(
    [
      function doTasks(callback) {
        race(tasks, callback);
      },
      function addElementHolder(element, callback) {
        const elementHolder = makeArgumentHolder(element);
        callback(null, elementHolder);
      },
      function moveTasksToFinalCallback(elementHolder, callback) {
        finalCallbackHolder.appendChild(elementHolder);
        callback(null, elementHolder);
      },
      function highlightTaskHolder(elementHolder, callback) {
        doTask({
          element: elementHolder,
          color: colors.argsHolder,
          delay: 500,
          callback,
        });
      },
      function doFinalTask(_, callback) {
        doTaskWithArguments({
          element: finalCallback,
          holder: finalCallbackHolder,
          callback,
        });
      }
    ],
    function showFinalMessage() {
      console.log(FINAL_MESSAGE);
    }
  );
}
