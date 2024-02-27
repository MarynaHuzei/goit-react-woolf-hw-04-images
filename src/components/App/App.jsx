import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import Loader from '../Loader/Loader';
import styles from './App.module.css';

const API_KEY = '38012427-abdef302c1869514a7af9c6c2';
const BASE_URL = 'https://pixabay.com/api/';

export const App = () => {
  const [searchName, setSearchName] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setIsSearchPerformed(true);

      try {
        const response = await axios.get(BASE_URL, {
          params: {
            q: searchName,
            page: currentPage,
            key: API_KEY,
            image_type: 'photo',
            orientation: 'horizontal',
            per_page: 12,
          },
        });

        setImages(prevImages => [...prevImages, ...response.data.hits]);
        setTotalPages(Math.ceil(response.data.totalHits / 12));
      } catch (error) {
        error('Error fetching images');
      } finally {
        setIsLoading(false);
      }
    };
    if (searchName) {
      fetchImages();
    }
  }, [searchName, currentPage]);

  const handleSearch = searchQuery => {
    setSearchName(searchQuery);
    setCurrentPage(1);
    setImages([]);
    setIsLoading(false);
    setTotalPages(0);
  };

  const loadMoreImages = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const openModal = image => {
    setModalImage(image.largeImageURL);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleSearch} />
      {isSearchPerformed && (
        <ImageGallery images={images} onImageClick={openModal} />
      )}

      {modalImage && (
        <Modal largeImageURL={modalImage} closeModal={closeModal} />
      )}
      {isLoading && isSearchPerformed && <Loader />}
      {!isLoading && images.length === 0 && isSearchPerformed && (
        <p className={styles.noMatches}>No matches found.</p>
      )}
      {!isLoading && images.length > 0 && currentPage < totalPages && (
        <Button handleClick={loadMoreImages}>Load More</Button>
      )}
    </div>
  );
};
