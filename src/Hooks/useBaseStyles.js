import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mt0: {
    marginTop: 0,
  },
  mr0: {
    marginRight: 0,
  },
  mb0: {
    marginBottom: 0,
  },
  ml0: {
    marginLeft: 0,
  },
  mx0: {
    marginLeft: 0,
    marginRight: 0,
  },
  my0: {
    marginTop: 0,
    marginBottom: 0,
  },
  m0: {
    margin: 0,
  },

  mt1: {
    marginTop: theme.spacing(1),
  },
  mr1: {
    marginRight: theme.spacing(1),
  },
  mb1: {
    marginBottom: theme.spacing(1),
  },
  ml1: {
    marginLeft: theme.spacing(1),
  },
  mx1: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  my1: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  m1: {
    margin: theme.spacing(1),
  },

  mt2: {
    marginTop: theme.spacing(2),
  },
  mr2: {
    marginRight: theme.spacing(2),
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
  ml2: {
    marginLeft: theme.spacing(2),
  },
  mx2: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  my2: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  m2: {
    margin: theme.spacing(2),
  },

  pt0: {
    paddingTop: 0,
  },
  pr0: {
    paddingRight: 0,
  },
  pb0: {
    paddingBottom: 0,
  },
  pl0: {
    paddingLeft: 0,
  },
  px0: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  py0: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  p0: {
    padding: 0,
  },

  pt1: {
    paddingTop: theme.spacing(1),
  },
  pr1: {
    paddingRight: theme.spacing(1),
  },
  pb1: {
    paddingBottom: theme.spacing(1),
  },
  pl1: {
    paddingLeft: theme.spacing(1),
  },
  px1: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  py1: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  p1: {
    padding: theme.spacing(1),
  },

  pt2: {
    paddingTop: theme.spacing(2),
  },
  pr2: {
    paddingRight: theme.spacing(2),
  },
  pb2: {
    paddingBottom: theme.spacing(2),
  },
  pl2: {
    paddingLeft: theme.spacing(2),
  },
  px2: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  py2: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  p2: {
    padding: theme.spacing(2),
  },

  flex: {
    display: "flex",
    alignItems: "center",
  },

  cursorPointer: {
    cursor: "pointer",
  },

  success: {
    color: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

export default function useBaseStyles() {
  return useStyles();
}
