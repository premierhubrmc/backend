import { createEvent, deleteEvent, getEventById, getUpcomingEvents } from "../models/eventModel.js";


export const fetchEvents = async (req, res) => {
  try {
    const events = await getUpcomingEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





export const fetchEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({ message: `Event with id ${id} not found` });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};





export const addEvent = async (req, res) => {
  try {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);  // 👈 see what’s inside

    const event = await createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    console.error("Error in addEvent:", err);
    res.status(500).json({ error: err.message });
  }
};




export const removeEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteEvent(id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
