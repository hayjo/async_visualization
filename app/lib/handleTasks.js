import { waterfall } from 'async';

export const colors = {
  task: {
    start: 'salmon',
    end: '#8cf3a4',
  },
  holder: {
    start: '#8cf3a4',
    end: '#d3fcdc',
  },
  argsHolder: {
    start: '#d39d9d',
    end: '#c0e3c0',
  },
  final: {
    start: '#eaf8ed',
    end: 'rgb(247, 196, 196)',
  }
};

export function generateRandomInt(min = 400, max = 1500) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
export function doTask({ element, color, delay, callback }) {
  const animation = element.animate({
    backgroundColor: color.start,
  }, delay);
  animation.finished.then(() => {
    element.style.backgroundColor = color.end;
    callback(null, element);
  });
}
export function doTaskWithArguments({ element, holder, callback: finalCallback }) {
  waterfall(
    [
      function doFirstTask(callback) {
        doTask({
          element: holder,
          color: colors.final,
          delay: 300,
          callback,
        });
      },
      function doSecondTask(_, callback) {
        doTask({
          element,
          color: colors.task,
          delay: 500,
          callback,
        });
      },
    ],
    function final() {
      doTask({
        element: holder,
        color: colors.holder,
        delay: 300,
        callback: finalCallback,
      });
    }
  );
}
function makeTask(content) {
  const task = document.createElement('div');
  task.classList.add('task');
  task.textContent = content;

  return task;
}
function makeTasks(n) {
  const taskList = [];
  for (let i = 0; i < n; i++) {
    const task = makeTask(`Task${i + 1}`);
    taskList.push(task);
  }

  return taskList;
}
function makeFinalCallback(parent) {
  const task = makeTask('Final');
  const holder = makeArgumentHolder(task);
  parent.appendChild(holder);

  return {
    task,
    holder,
  };
}
export function makeArgumentHolder(elements) {
  if (!Array.isArray(elements) && !(elements instanceof HTMLElement)) {
    throw new Error("1st parameter of makeArgumentHolder accepts an array or an element");
  }

  const holder = document.createElement('div');
  holder.classList.add('argument-holder');

  if (Array.isArray(elements)) {
    elements.forEach((element) => {
      holder.appendChild(element);
    });

    return holder;
  }

  holder.appendChild(elements);
  return holder;
}
export function setDefault(parent) {
  const FINAL_MESSAGE = `${parent.parentNode.className} is done!`;
  const taskElements = makeTasks(5);
  const taskHolder = makeArgumentHolder(taskElements);
  parent.appendChild(taskHolder);
  const { task: finalCallback, holder: finalCallbackHolder } = makeFinalCallback(parent);

  return {
    FINAL_MESSAGE,
    taskElements,
    taskHolder,
    finalCallback,
    finalCallbackHolder,
  };
}
