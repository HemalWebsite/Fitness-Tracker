import React from 'react';
import GaugeComponent from './guage';
import styles from './Card.module.css';


function Card1({ header, value, MV, color }) {
    return (
        <div className="card text-center mt-3" style={{ height: '100%', width:'100%', backgroundColor:'white' }}>
            <div className={`card-header ${styles.CH}`}>
                {header}
            </div>
            <div className="card-body" style={{ height: '100%' }}>

                <GaugeComponent value={value} height={150} width={150} color={color} MV={MV} />
                <p className="card-text">{String(value)} / {String(MV)}</p>

            </div>
        </div>
    );
}

export default Card1;
