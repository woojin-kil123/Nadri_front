import Calendar from "./Calendar";

const Event = () => {
  const upcomingEvents = [
    {
      title: "Glastonbury Festival",
      date: "26 April 2025 - 12:00 PM",
      location: "62 Winder Road Apt. 521",
      host: "Tara and Cassie Hudson",
    },
    {
      title: "Ultra Europe 2019",
      date: "19 October 2025 - 9:00 PM",
      location: "325 Scudder Tunnel Apt. 943",
      host: "Sara Nestor",
    },
  ];
  const calendarEvents = [
    {
      date: "2025-04-02",
      title: "Design Conference",
      location: "706 Division Maison Suite 157",
      organizer: "Total Design Agency",
    },
    {
      date: "2025-04-15",
      title: "Weekend Festival",
    },
    {
      date: "2025-04-25",
      title: "Summer Festival",
    },
  ];
  return (
    <div className="event-page">
      <section className="upcoming-events">
        <h2>다가오는 일정</h2>
        <div className="event-list">
          {upcomingEvents.map((event, index) => (
            <div className="event-card" key={index}>
              <div className="event-thumbnail"></div>
              <div className="event-info">
                <h3>{event.title}</h3>
                <p>{event.date}</p>
                <p>{event.location}</p>
                <p>{event.host}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="calendar-section">
        <h2>일정 관리</h2>
        <Calendar />
      </section>
    </div>
  );
};
export default Event;
