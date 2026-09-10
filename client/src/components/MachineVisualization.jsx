import { useMemo } from 'react';

export default function MachineVisualization({ state }) {
  const { temperature, humidity, fanSpeed, heaterOn, solarIntensity, airflow, moisture, progress } = state;

  const tempColor = temperature > 50 ? '#ff4444' : temperature > 40 ? '#ff8800' : '#44bb44';
  const humColor = humidity > 70 ? '#4488ff' : humidity > 50 ? '#44bb44' : '#ffaa00';

  const fanAngle = useMemo(() => {
    if (fanSpeed === 0) return 0;
    return (Date.now() / (10 - fanSpeed * 0.08)) % 360;
  }, [fanSpeed, state.elapsed]);

  return (
    <div className="machine-viz">
      <svg viewBox="0 0 400 350" className="machine-svg">
        <defs>
          <linearGradient id="solarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffdd00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff8800" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="chamberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a3a" />
            <stop offset="100%" stopColor="#1a1a2a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="heatGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Solar Panel */}
        <g transform="translate(120, 15)">
          <rect x="0" y="0" width="160" height="40" rx="4" fill="#1a3a5a" stroke="#2a5a8a" strokeWidth="2" />
          {[0,1,2,3].map(i => (
            <rect key={i} x={5 + i * 39} y="5" width="34" height="30" rx="2"
              fill={`rgba(40,120,200,${0.3 + solarIntensity/2000})`} stroke="#3a6a9a" strokeWidth="1" />
          ))}
          {solarIntensity > 100 && (
            <g filter="url(#glow)">
              {[0,1,2,3,4].map(i => (
                <line key={i} x1={30 + i * 30} y1="-8" x2={30 + i * 30} y2="0"
                  stroke="#ffdd00" strokeWidth="2" opacity={solarIntensity / 1000} />
              ))}
            </g>
          )}
          <text x="80" y="55" textAnchor="middle" fill="#aaa" fontSize="10" fontFamily="monospace">
            {solarIntensity} W/m²
          </text>
        </g>

        {/* Hot air pipe */}
        <path d="M 200 55 L 200 75" stroke={tempColor} strokeWidth="3" fill="none"
          strokeDasharray={heaterOn ? "4,4" : "0"} opacity={heaterOn ? 1 : 0.3} />
        {heaterOn && [0,1,2].map(i => (
          <circle key={i} cx={200} cy={60 + i * 5} r="2" fill={tempColor} opacity={0.6 + i * 0.15}>
            <animate attributeName="cy" from={60 + i * 5} to={70 + i * 5} dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0.2" dur="1s" repeatCount="indefinite" />
          </circle>
        ))}

        {/* Drying Chamber */}
        <rect x="80" y="75" width="240" height="180" rx="8" fill="url(#chamberGrad)"
          stroke="#3a3a5a" strokeWidth="2" />

        {/* Chamber label */}
        <text x="200" y="95" textAnchor="middle" fill="#666" fontSize="10" fontFamily="monospace">
          DRYING CHAMBER
        </text>

        {/* Trays */}
        {[0, 1].map(i => (
          <g key={i} transform={`translate(100, ${120 + i * 60})`}>
            <rect x="0" y="0" width="200" height="3" rx="1" fill="#555" />
            <rect x="10" y="-15" width="180" height="12" rx="2" fill={`rgba(${100 + moisture}, ${150 - moisture}, 50, 0.6)`} />
            {Array.from({ length: 8 }, (_, j) => (
              <text key={j} x={25 + j * 22} y="-6" fontSize="10" opacity={0.5 + Math.random() * 0.3}>
                🌿
              </text>
            ))}
          </g>
        ))}

        {/* Moisture indicator */}
        <g transform="translate(340, 120)">
          <rect x="0" y="0" width="12" height="100" rx="3" fill="#1a1a2a" stroke="#333" strokeWidth="1" />
          <rect x="2" y={100 - moisture * 2.5} width="8" height={moisture * 2.5} rx="2" fill={humColor} />
          <text x="6" y="115" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace">
            {moisture.toFixed(0)}%
          </text>
        </g>

        {/* Fan */}
        <g transform="translate(310, 200)">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#444" strokeWidth="2" />
          <g style={{ transform: `rotate(${fanAngle}deg)`, transformOrigin: '0 0' }}>
            {[0, 90, 180, 270].map(angle => (
              <ellipse key={angle} cx="0" cy="-10" rx="3" ry="10"
                fill={fanSpeed > 0 ? '#6aafcf' : '#444'}
                transform={`rotate(${angle})`} />
            ))}
          </g>
          <circle cx="0" cy="0" r="3" fill="#888" />
          <text x="0" y="30" textAnchor="middle" fill="#aaa" fontSize="10" fontFamily="monospace">
            FAN {fanSpeed}%
          </text>
        </g>

        {/* Heater indicator */}
        <g transform="translate(90, 200)">
          <rect x="-15" y="-12" width="30" height="24" rx="3"
            fill={heaterOn ? '#ff4444' : '#333'} opacity={heaterOn ? 0.8 : 0.3}
            filter={heaterOn ? 'url(#heatGlow)' : undefined} />
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">
            {heaterOn ? 'ON' : 'OFF'}
          </text>
          <text x="0" y="22" textAnchor="middle" fill="#aaa" fontSize="9" fontFamily="monospace">
            HEATER
          </text>
        </g>

        {/* Airflow arrows */}
        {fanSpeed > 0 && [0, 1, 2].map(i => (
          <g key={i} opacity={0.4 + (airflow / 4)}>
            <line x1={140 + i * 60} y1={260} x2={140 + i * 60} y2={280}
              stroke="#6aafcf" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </g>
        ))}
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#6aafcf" />
          </marker>
        </defs>

        {/* Moist air out */}
        <text x="200" y="300" textAnchor="middle" fill="#666" fontSize="9" fontFamily="monospace">
          MOIST AIR OUT
        </text>
        <path d="M 200 275 L 200 295" stroke="#666" strokeWidth="2" strokeDasharray="3,3" />

        {/* Temperature label */}
        <text x="55" y="175" textAnchor="middle" fill={tempColor} fontSize="13" fontFamily="monospace" fontWeight="bold">
          {temperature}°C
        </text>

        {/* Humidity label */}
        <text x="55" y="210" textAnchor="middle" fill={humColor} fontSize="11" fontFamily="monospace">
          {humidity}%
        </text>
      </svg>

      <div className="machine-stats">
        <span className="stat">Progress: {progress}%</span>
        <span className="stat">Airflow: {airflow} m/s</span>
      </div>
    </div>
  );
}
