'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Grid } from '@mui/material';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/_interfaces';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'

const Home: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([])
  const [activeCard, setActiveCard] = useState(0);
  const cardGridRef = useRef(null);
  const [showCard, setShowCard] = React.useState(0);

  useEffect(() => {
    loadList();
  }, []);

  //Load Product List
  const loadList = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  //Keyboard action handel
  useEffect(() => {
    const handleKeyDown = (event: { key: any; }) => {
      switch (event.key) {
        case 'ArrowUp':
          if (activeCard > 4) {
            setActiveCard(activeCard - 5);
          }
          break;
        case 'ArrowDown':
          if (activeCard < productList.length - 5) {
            setActiveCard(activeCard + 5);
          }
          break;
        case 'ArrowDown':
          if (activeCard < productList.length - 1) {
            setActiveCard(activeCard + 1);
          }
          break;
        case 'ArrowLeft':
          if (activeCard > 0) {
            setActiveCard(activeCard - 1);
          }
          break;
        case 'ArrowRight':
          if (activeCard < productList.length - 1) {
            setActiveCard(activeCard + 1);
          }
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, [activeCard, productList.length]);

  //Drag and Drop
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setProductList((product: any) =>
      update(product, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, product[dragIndex]],
        ],
      }),
    )
  }, [])

  const renderList = () => {
    return productList.map((product, index) => (
      <Grid item key={product?.id} onClick={() => setShowCard(product?.id)}>
        <ProductCard
          product={product}
          isActive={product?.id === activeCard}
          productId={product?.id}
          onFocus={setActiveCard}
          showCad={showCard}
          index={index}
          moveProductCard={moveCard}
        />
      </Grid>
    ))
  }

  return (
    <Container className="mt-4">
      {
        productList ?
          <Grid
            container
            spacing={2}
            ref={cardGridRef}
            columns={{ xs: 5, sm: 5, md: 5 }} >
            <DndProvider
              backend={HTML5Backend}>
              {renderList()}
            </DndProvider>
          </Grid> :
          <h5>Loading...</h5>
      }
    </Container >
  )
}

export default Home;