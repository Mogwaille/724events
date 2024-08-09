import React, { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [category, setCategory] = useState(''); // Changement type à category pour la clareté, et chaine vide pour qu'aucune catégorie soit sélectionnée de base
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = data?.events.filter(event => 
    !category || event.type === category
  ); // Filtrage sur le catégorie sélectionné, si catégorie vide alors tous, sinon seulement catégorie sélectionné

  const paginatedEvents = filteredEvents?.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  ); // Utilisation de slice pour avoir uniquement les events de la catégorie

  const changeCategory = (newCategory) => {
    setCurrentPage(1);
    setCategory(newCategory);
  };

  const pageNumber = Math.ceil((filteredEvents?.length || 0) / PER_PAGE); // On enlève le + 1 qui faussait le résultat 
  const typeList = Array.from(new Set(data?.events.map(event => event.type)));

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={(value) => changeCategory(value)}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents?.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber)].map((_, n) => (
              <a key={`page-${n + 1}`} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;