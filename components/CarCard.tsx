import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

import Link from 'next/link';
import { Car } from '../types';

type CarCardProps = {
  car: Car;
  favorited: boolean;
  handleFavoriteAction: (favorited: boolean, carName: string) => void;
}

export default function CarCard({ car, favorited, handleFavoriteAction }: CarCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://picsum.photos/345/140"
  }

  const onFavoriteClick = () => {
    handleFavoriteAction(favorited, car.id)
  }

  return (
    <Card sx={{ width: 320 }}>
      <Link href={encodeURI(car.name)} passHref>
        <CardActionArea>
          <CardMedia
            component="img"
            height="175"
            image={`https://jwwfejqbidkztahfvrlv.supabase.co/storage/v1/object/public/cars/${encodeURI(`${car.makers.name} ${car.name}`)}.webp`}
            alt={`${car.makers.name} ${car.name}`}
            onError={handleImageError}
          />
        </CardActionArea>

      </Link>
      {favorited ?
        <StarIcon htmlColor="#FFD700" onClick={onFavoriteClick} />
        :
        <StarOutlineIcon onClick={onFavoriteClick} />
      }
      <CardContent sx={{ height: 100 }}>
        <Typography gutterBottom variant="subtitle2" component="p">
          {car.makers.name}
        </Typography>
        <Typography gutterBottom variant="subtitle1" component="p" sx={{ lineHeight: 1.5 }}>
          {car.name}
        </Typography>
      </CardContent>
    </Card >
  )
}
