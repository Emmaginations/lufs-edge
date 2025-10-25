import { useEffect, useState } from 'react';
import supabase from './supabase';

function App() {
  const [skaters, setSkaters] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    skaterName: '',
    eventName: '',
    placement: '',
    groupSize: '',
    group: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch skaters and events from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: skaterData, error: skaterError } = await supabase
          .from('Skater')
          .select('SkaterID, FirstName, LastName');

        if (skaterError) console.error('Error fetching skaters:', skaterError);
        else setSkaters(skaterData || []);

        const { data: eventData, error: eventError } = await supabase
          .from('Event')
          .select('EventID, EventName');

        if (eventError) console.error('Error fetching events:', eventError);
        else setEvents(eventData || []);
      } catch (err) {
        console.error('Unexpected fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.skaterName) newErrors.skaterName = 'Skater is required.';
    if (!formData.eventName) newErrors.eventName = 'Event name is required.';
    if (!(+formData.placement > 0 && +formData.placement <= 24))
      newErrors.placement = 'Placement must be 1-24.';
    if (!(+formData.groupSize > 0 && +formData.groupSize <= 24))
      newErrors.groupSize = 'Group size must be 1-24.';
    if (formData.group && !/^[A-Z]$/.test(formData.group))
      newErrors.group = 'Group must be a single capital letter.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const [firstName, lastName] = formData.skaterName.split(' ');

    // Ensure Event exists
    let { data: eventData } = await supabase
      .from('Event')
      .select('EventID')
      .eq('EventName', formData.eventName)
      .eq('CompID', 1)
      .single();

    let eventID;
    if (!eventData) {
      const { data: newEvent } = await supabase
        .from('Event')
        .insert([{ EventName: formData.eventName, IsChamp: false, CompID: 1 }])
        .select()
        .single();
      eventID = newEvent?.EventID;
    } else {
      eventID = eventData.EventID;
    }

    // Get Points value
    const { data: pointData } = await supabase
      .from('PointValues')
      .select('Points')
      .eq('GroupSize', formData.groupSize)
      .eq('Placement', formData.placement)
      .single();

    const points = pointData?.Points ?? 0;

    // Get Skater ID
    const { data: skater } = await supabase
      .from('Skater')
      .select('SkaterID')
      .eq('FirstName', firstName)
      .eq('LastName', lastName)
      .single();

    const skaterID = skater?.SkaterID;

    // Post Result
    const result = {
      EventID: eventID,
      SkaterID: skaterID,
      Points: points,
      Group: formData.group || null,
    };

    const { error: insertError } = await supabase.from('Result').insert([result]);

    if (!insertError) {
      alert('Result added!');
      setFormData({ skaterName: '', eventName: '', placement: '', groupSize: '', group: '' });
    } else {
      alert('Error adding result.');
    }
  };

  return (
    <div className="App">
      <h2>Add Result</h2>

      {/* Skater Dropdown */}
      <div>
        <label>Skater:</label>
        <select
          value={formData.skaterName}
          onChange={(e) => setFormData({ ...formData, skaterName: e.target.value })}
        >
          <option value="">Select Skater</option>
          {skaters.map((s) => (
            <option key={s.SkaterID} value={`${s.FirstName} ${s.LastName}`}>
              {s.FirstName} {s.LastName}
            </option>
          ))}
        </select>
        {errors.skaterName && <p>{errors.skaterName}</p>}
      </div>

      {/* Event Dropdown */}
      <div>
        <label>Event Name:</label>
        <select
          value={formData.eventName}
          onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.EventID} value={e.EventName}>
              {e.EventName}
            </option>
          ))}
        </select>
        {errors.eventName && <p>{errors.eventName}</p>}
      </div>

      {/* Placement */}
      <div>
        <label>Placement (1-24):</label>
        <input
          type="number"
          value={formData.placement}
          onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
        />
        {errors.placement && <p>{errors.placement}</p>}
      </div>

      {/* Group Size */}
      <div>
        <label>Group Size (1-24):</label>
        <input
          type="number"
          value={formData.groupSize}
          onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
        />
        {errors.groupSize && <p>{errors.groupSize}</p>}
      </div>

      {/* Optional Group */}
      <div>
        <label>Group (A-Z):</label>
        <input
          type="text"
          value={formData.group}
          onChange={(e) => setFormData({ ...formData, group: e.target.value.toUpperCase() })}
          maxLength="1"
        />
        {errors.group && <p>{errors.group}</p>}
      </div>

      <button onClick={handleSubmit}>Add Result</button>
    </div>
  );
}

export default App;
