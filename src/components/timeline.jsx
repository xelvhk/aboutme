import React from 'react';
import PropTypes from 'prop-types';
import './timeline.css';

const Timeline = ({ events }) => {
    if (!events || !Array.isArray(events) || events.length === 0) {
        return <p>No timeline events available.</p>;
    }

    return (
        <div className="timeline">
            {events.map((event, index) => (
                <div className="timeline-event" key={`${event.date}-${event.title}-${index}`}>
                    <div className="timeline-date">{event.date || 'Date not specified'}</div>
                    <div className="timeline-title">{event.title || 'Title not specified'}</div>
                    <div className="timeline-content">{event.place || 'Place not specified'}</div>
                </div>
            ))}
        </div>
    );
};

Timeline.propTypes = {
	events: PropTypes.arrayOf(
		PropTypes.shape({
			date: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			place: PropTypes.string.isRequired,
		})
	).isRequired,
};

export default Timeline;