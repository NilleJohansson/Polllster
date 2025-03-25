import { createTheme } from "@mui/material/styles";
import { orange, blue } from "@mui/material/colors";

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    greyVariant: true;
    transparentVariant: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    borderTop: true
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: orange[400],
    },
    secondary: {
      main: blue[500],
    },
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#374151",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1F2937",
        },
      },
      variants: [
        {
          props: { variant: 'borderTop' },
          style: {
            borderTop: "6px solid",
            borderTopColor: orange[400],
              }
          },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1F2937"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "#6B7280", // Set your default label color here
          },
          // input label when focused
          "& label.Mui-focused": {
            color: orange[400],
          },
          // focused color for input with variant='standard'
          "& .MuiInput-underline:after": {
            borderBottomColor: orange[400],
          },
          // focused color for input with variant='filled'
          "& .MuiFilledInput-underline:after": {
            borderBottomColor: orange[400],
          },
          // focused color for input with variant='outlined'
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: orange[400],
            },
          },
          '& .MuiInputBase-root': {
            color: "#6B7280",    
            fontSize: '18px',
            "& .MuiInputAdornment-root": {
              color: '#6B7280',
            }   
            },
          backgroundColor: "#374151",
          borderRadius: '12px',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          // input label when focused
          '&& .Mui-selected, && .Mui-selected:hover': {
            color: orange[400],
            background: 'black'
          }
      }
    }
  },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#374151",
          "& .MuiSelect-root": {
            color: 'red'
          },
          "& .MuiSelect-select": {
            color: '#dde2f0'
          },
          "& .MuiSelect-icon": {
            color: '#606675',
            fontSize: '3rem',
        }
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "#1F2937",
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: "#1F2937",
          color: '#dde2f0',
          "&:hover": {
            backgroundColor: orange[400],
            color: '#fff'
          },
          "&.Mui-selected": {
            backgroundColor: orange[400],
            "&.Mui-focusVisible": { background: orange[400] },
            "&:hover": {
              backgroundColor: orange[400],
            }
          }
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        checked: {
          color: '#fff',
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#fff'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            filter: 'brightness(0.85)',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
      variants: [
        {
          props: { variant: 'greyVariant' },
          style: {
              background: '#374151',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                background: '#374151',
                filter: 'brightness(1.20)'
              }
          },
        },
        {
          props: {
            variant: 'transparentVariant'
          },
          style: {
            background: 'transparent',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              color: orange[400],
              filter: 'brightness(1.20)',
              backgroundColor: 'transparent',
            },
          }
        } 
      ]
    }
  },
});
