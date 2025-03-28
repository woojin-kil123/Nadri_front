import { Menu, MenuItem } from "@mui/material";

const Dropdown = (props) => {
  const className = props.className;
  const id = props.id;
  const menus = props.menus;
  const anchorEl = props.anchorEl;
  const setAnchorEl = props.setAnchorEl;
  const direction = props.direction || "bottom";

  const open = Boolean(anchorEl);
  const isTop = direction === "top";

  const close = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Menu
      className={className}
      anchorEl={anchorEl}
      id={id}
      open={open}
      onClose={close}
      onClick={close}
      anchorOrigin={{
        horizontal: "right",
        vertical: isTop ? "top" : "bottom",
      }}
      transformOrigin={{
        horizontal: "right",
        vertical: isTop ? "bottom" : "top",
      }}
      disablePortal={false}
      disableScrollLock={true}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: isTop ? 0 : 1.5,
            mb: isTop ? 1.5 : 0,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: isTop ? "auto" : 0,
              bottom: isTop ? 0 : "auto",
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: isTop
                ? "translateY(50%) rotate(45deg)"
                : "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
    >
      {menus.map((menu, i) => (
        <MenuItem key={`menuitem-${i}`} onClick={menu.clickFunc}>
          {menu.icon}
          {menu.name}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default Dropdown;
