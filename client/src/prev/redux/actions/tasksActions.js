import { axiosInstanceCreator } from "../misc";
import {
  CLEAR_ERRORS, SET_ERRORS, SET_METER_TYPES,
  SET_TASKS, SET_TASK_LOADING,
  SET_USERS_TASKS
} from "../types";

export const CreateSystemTask = (task, dcuId) => (dispatch, getState) => {
  const system_mode = getState().ui.systemMode;
  const dcu = { id: dcuId };
  console.log("create");
  console.log(dcuId);
  return axiosInstanceCreator(dcuId ? dcu : null, "put", `/api/systemtask`, {
    dcuId: dcuId,
    systemMode: dcuId ? "dcu" : system_mode,
    task: task,
  });
};

export const getSystemTasks = (dcuId) => (dispatch, getState) => {
  const system_mode = getState().ui.systemMode;
  const dcu = { id: dcuId };

  return axiosInstanceCreator(dcuId ? dcu : null, "post", `/api/systemtask`, {
    dcuId: dcuId,
    systemMode: dcuId ? "dcu" : system_mode,
  });
  // dispatch({ type: SET_TASK_LOADING, payload: "systemtasks" });
  // dispatch({ type: CLEAR_ERRORS });
  // //console.log(userData);

  // // const dcu = dcuId && { dcu: { id: dcuId } };
  // // const dcu = getState().data.dcu;
  // const system_mode = getState().ui.systemMode;

  // axiosInstanceCreator(null, "post", `/api/systemtask`, {
  //   dcuId: dcuId,
  //   systemMode: system_mode,
  // })
  //   .then((res) => {
  //     console.log(res.data);
  //     if (res.data.tasks) {
  //       dispatch({
  //         type: SET_SYSTEM_TASKS,
  //         payload: res.data.tasks,
  //       });
  //     }
  //     if (res.data.dcuList) {
  //       dispatch({
  //         type: SET_DCU_LIST,
  //         payload: [...res.data.dcuList],
  //       });
  //     }
  //     dispatch({ type: SET_TASK_LOADING, payload: false });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     dispatch({
  //       type: SET_ERRORS,
  //       payload: { notification: err.response.data },
  //     });
  //     dispatch({ type: SET_TASK_LOADING, payload: false });
  //     // dispatch({ type: STOP_LOADING_USER });
  //     // dispatch({ type: STOP_LOADING_UI });
  //   });
};

export const getUserTasks = (dcuId) => (dispatch, getState) => {
  dispatch({ type: SET_TASK_LOADING, payload: "tasks" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  // const dcu = dcuId && { dcu: { id: dcuId } };
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", `/api/usertasks/${dcuId}`)
    .then((res) => {
      dispatch({ type: SET_USERS_TASKS, payload: res.data.user_tasks });
      dispatch({ type: SET_METER_TYPES, payload: res.data.meter_types });
      dispatch({ type: SET_TASKS, payload: res.data.tasks });
      dispatch({ type: SET_TASK_LOADING, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_TASK_LOADING, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const getMeterUserTasks = (dcuId, tasksToUpdate) => {
  return (dispatch) => {
    // console.log(dcuId);
    // const dcu = dcuId && { id: dcuId };
    return axiosInstanceCreator(null, "post", "/api/usertasksdcu", {
      id: dcuId,
      tasks: tasksToUpdate,
    });
  };
};

export const createTask = (task) => (dispatch, getState) => {
  dispatch({ type: CLEAR_ERRORS });
  const user_id = getState().user.user.id.toString();
  const system_mode = getState().ui.systemMode;
  const taskToSend = task;
  taskToSend.userId = user_id;
  taskToSend.systemMode = system_mode;
  const dcu = getState().data.dcu;
  if (!task.filePath) {
    if (
      parseInt(task.taskType) === 40 ||
      parseInt(task.taskType) === 5 ||
      parseInt(task.taskType) === 3 ||
      parseInt(task.taskType) === 6 ||
      parseInt(task.taskType) === 22 ||
      (parseInt(task.taskType) === 10 && task.file)
    ) {
      const formData = new FormData();
      const fileToSend = task.file;

      formData.append("fileUpload", fileToSend, fileToSend.name);

      taskToSend.file = null;
      formData.append("data", JSON.stringify(taskToSend));

      return axiosInstanceCreator(dcu, "post", "/api/usertaskfile", formData);
    }
  }
  return axiosInstanceCreator(dcu, "post", "/api/usertask", taskToSend);
  // .then((res) => {
  //   console.log(res);
  //   const newTasks = [...getState().tasks.userTasks, res.data];
  //   console.log(newTasks);
  //   dispatch({ type: SET_USERS_TASKS, payload: newTasks });
  //   dispatch({ type: SET_TASK_LOADING, payload: false });
  //   return true;
  // })
  // .catch((err) => {
  //   console.log(err);
  //   dispatch({
  //     type: SET_ERRORS,
  //     payload: { notification: err.response.data },
  //   });
  //   dispatch({ type: SET_TASK_LOADING, payload: false });
  // });
};

export const getTaskDetails = (dcuId, task) => {
  return (dispatch) => {
    const dcu = dcuId && { id: dcuId };
    return axiosInstanceCreator(dcu, "post", "/api/taskexecinfo", {
      taskId: task,
      dcuId: dcuId,
    });
  };
};

export const getTaskFiles = (dcuId, task) => {
  return (dispatch) => {
    const dcu = dcuId && { id: dcuId };
    return axiosInstanceCreator(dcu, "post", "/api/taskfiles", {
      taskId: task,
      dcuId: dcuId,
    });
  };
};

export const downloadTaskFile = (dcuId, task) => {

  return (dispatch) => {
    const dcu = dcuId && { id: dcuId };

    return axiosInstanceCreator(dcu, "get", `/api/taskfile/${task}`, "blob");
  };
};

export const getTaskProps = () => {
  return (dispatch, getState) => {
    // const dcu = dcuId && { id: dcuId };
    // console.log(dcu);
    dispatch({ type: SET_TASK_LOADING, payload: "tasks" });
    dispatch({ type: CLEAR_ERRORS });
    const dcu = getState().data.dcu;
    axiosInstanceCreator(dcu, "get", "/api/usertasksprops")
      .then((res) => {
        dispatch({ type: SET_METER_TYPES, payload: res.data.meter_types });
        dispatch({ type: SET_TASKS, payload: res.data.tasks });
        dispatch({ type: SET_TASK_LOADING, payload: false });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: SET_ERRORS,
          payload: { notification: err.response.data },
        });
        dispatch({ type: SET_TASK_LOADING, payload: false });
      });
  };
};

export const getTaskInstances =
  (dcuId, dateFrom, dateTo) => (dispatch, getState) => {
    const dcu = { id: dcuId };

    return axiosInstanceCreator(
      dcuId ? dcu : null,
      "post",
      `/api/taskinstance`,
      {
        dcuId: dcuId,
        dateFrom: dateFrom,
        dateTo: dateTo,
      }
    );
  };

export const getTaskedMeterInstances =
  (dcuId, taskInstanceId) => (dispatch, getState) => {
    const dcu = { id: dcuId };

    return axiosInstanceCreator(
      dcuId ? dcu : null,
      "post",
      `/api/taskedmeterinst`,
      {
        dcuId: dcuId,
        taskInstanceId: taskInstanceId,
      }
    );
  };

export const getTaskInstanceLog = (id, dcuId) => {
  return (dispatch) => {
    // console.log(dcuId);
    const dcu = dcuId && { id: dcuId };
    return axiosInstanceCreator(dcu, "get", `/api/taskinstancelog/${id}`);
  };
};

export const getTaskedMeterInstanceLog = (id, dcuId) => {
  return (dispatch) => {
    const dcu = dcuId && { id: dcuId };
    return axiosInstanceCreator(
      dcu,
      "get",
      `/api/taskedmeterinstancelog/${id}`
    );
  };
};

export const getDirectAccessTaskDetails = (
  meters,
  userTaskId,
  dcuId,
  timeStamp
) => {
  return (dispatch, getState) => {
    return axiosInstanceCreator(null, "post", `/api/directacctask`, {
      meters: meters,
      user_task_id: userTaskId,
      dcu_id: dcuId,
      created_on: timeStamp,
    });
  };
};

export const getKPIReports = (id, dcuId) => {
  return (dispatch) => {
    // console.log(dcuId);
    const dcu = dcuId && { id: dcuId };
    return axiosInstanceCreator(dcu, "get", `/api/kpireports/`);
  };
};

export const restartUserTask = (data, dcuId) => {
  return (dispatch) => {
    return axiosInstanceCreator(null, "post", `/api/usertaskrestart`, data);
  };
};

export const deleteUserTask = (userTaskId, dcuId) => {
  return (dispatch) => {
    // console.log(dcuId);
    // const dcu = dcuId && { id: dcuId };
    return axiosInstanceCreator(null, "delete", "/api/usertask", {
      user_task_id: userTaskId,
      dcu_id: dcuId,
    });
  };
};

export const getUserTaskDetails = (userTaskId, taskType, dcuId) => {
  return (dispatch) => {
    const dcu = dcuId && { id: dcuId };
    return axiosInstanceCreator(dcu, "post", "/api/usertaskdetails", {
      user_task_id: userTaskId,
      task_type: taskType,
      dcu_id: dcuId,
    });
  };
};

export const stopUserTask = (userTaskId, dcuId) => {
  return (dispatch) => {
    return axiosInstanceCreator(null, "post", "/api/usertaskstop", {
      user_task_id: userTaskId,
      dcu_id: dcuId,
    });
  };
};
