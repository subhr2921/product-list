import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Product } from '@/_interfaces';
import { useDrag, useDrop } from 'react-dnd'
import type { Identifier, XYCoord } from 'dnd-core'

interface ProductCellProps {
  product: Product | null;
  isActive: boolean;
  onFocus: any;
  productId: number;
  showCad: any;
  index: number;
  moveProductCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const ItemTypes = {
  CARD: 'card',
}

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  cursor: 'move',
}

const ProductCard: React.FC<ProductCellProps> = ({
  product,
  isActive,
  onFocus,
  productId,
  showCad,
  index,
  moveProductCard
}) => {

  const ref = React.useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      moveProductCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { productId, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <Card
      ref={ref}
      style={{ ...style, opacity }}
      className={`blank-card ${isActive ? 'active' : ''}`}
      tabIndex={isActive ? 0 : -1}
      onFocus={() => onFocus(productId)}
      data-handler-id={handlerId}
    >
      {
        showCad === productId ? <><CardMedia
          component="img"
          className='image'
          image={product?.image}
          alt={product?.title}
        />
          <CardContent>
            <Typography variant="body2" color="text.secondary">{product?.title}</Typography>
          </CardContent></> : <></>
      }
    </Card >
  );
}

export default ProductCard;