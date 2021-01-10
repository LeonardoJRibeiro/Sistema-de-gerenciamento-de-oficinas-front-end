import { Badge, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@material-ui/core';
import React, { memo, useContext } from 'react';
import { Link } from 'react-router-dom';
import WebSocketContext, { Dominio, Notification } from '../../contexts/WebSocketContext';

interface ItemDrawerProps {
  title: string;
  icon: React.ReactChild;
  navigateTo: string;
  dominio?: Dominio;
}

const ItemDrawer: React.FC<ItemDrawerProps> = ({ icon, navigateTo, title, dominio }) => {
  const { getNotification } = useContext(WebSocketContext);
  const notification = dominio ? getNotification(dominio) : {} as Notification
  const total = notification.changed + notification.inserted;

  return (
    <ListItem button component={Link} to={navigateTo}>
      <Tooltip title={title}>
        <ListItemIcon>
          <Badge color={total > 0 ? "primary" : "default"} badgeContent={total > 0 ? total : ""}>
            {icon}
          </Badge>
        </ListItemIcon>
      </Tooltip>
      <ListItemText>
        <Typography>
          {title}
        </Typography>
      </ListItemText>
    </ListItem >
  );
}

export default memo(ItemDrawer);