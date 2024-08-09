import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1 // > à la place de < pour plus récent au plus ancien
  );

  const nextCard = () => {
    if (byDateDesc && byDateDesc.length > 0) { // Vérifie que le tableau est défini avant d'éxécuter l'algorythme
      setTimeout(
        () => setIndex((prevIndex) => (prevIndex + 1) % byDateDesc.length), // Index incrémenté de 1 pour passer à la prochaine slide, modulo pour boucler
        5000
      );
    }
  };

  useEffect(() => {
    nextCard();
  }, [index, byDateDesc?.length]);

  if (!byDateDesc || byDateDesc.length === 0) {
    return <div className="SlideCardList">Aucune image disponible</div>;
  }

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div key={event.id || idx} className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}>
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={`pagination-${event.id || radioIdx}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;