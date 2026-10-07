const API_BASE_URL = "http://localhost:5000";

/* =========================================================
   GENERIC API REQUEST
   ========================================================= */

const apiRequest = async (
  endpoint,
  options = {}
) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return response.json();
};

/* =========================================================
   SUBJECT API
   ========================================================= */

const normalizeSubject = (subject) => ({
  ...subject,
  id: Number(subject.id),
  credits: Number(subject.credits || 0),
  semester: Number(subject.semester || 0),
});

export const getSubjects = async () => {
  const data = await apiRequest("/subjects");

  return data.map(normalizeSubject);
};

export const createSubject = async (subject) => {
  const data = await apiRequest(
    "/subjects",
    {
      method: "POST",
      body: JSON.stringify(subject),
    }
  );

  return normalizeSubject(data);
};

export const updateSubject = async (
  id,
  subject
) => {
  const data = await apiRequest(
    `/subjects/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(subject),
    }
  );

  return normalizeSubject(data);
};

export const deleteSubject = async (id) => {
  await apiRequest(
    `/subjects/${id}`,
    {
      method: "DELETE",
    }
  );

  return id;
};

/* =========================================================
   SCHEDULE API
   ========================================================= */

const normalizeSchedule = (schedule) => ({
  ...schedule,
  id: Number(schedule.id),
  subjectId: Number(schedule.subjectId),
  semester: Number(schedule.semester || 0),
});

export const getSchedules = async () => {
  const data = await apiRequest(
    "/schedules"
  );

  return data.map(normalizeSchedule);
};

export const createSchedule = async (
  schedule
) => {
  const data = await apiRequest(
    "/schedules",
    {
      method: "POST",
      body: JSON.stringify(schedule),
    }
  );

  return normalizeSchedule(data);
};

export const updateSchedule = async (
  id,
  schedule
) => {
  const data = await apiRequest(
    `/schedules/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(schedule),
    }
  );

  return normalizeSchedule(data);
};

export const deleteSchedule = async (
  id
) => {
  await apiRequest(
    `/schedules/${id}`,
    {
      method: "DELETE",
    }
  );

  return id;
};