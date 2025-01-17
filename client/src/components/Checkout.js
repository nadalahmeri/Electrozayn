import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import CheckoutValidation from "./CheckoutValidation";
import axios from "axios";
import { TiDelete } from "react-icons/ti";
import "react-toastify/dist/ReactToastify.css";
import { remove_fromcard } from "../redux/action/Action";
import { useDispatch } from "react-redux";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
  },
  card: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  image: {
    marginRight: "1rem",
    width: "50px",
    height: "50px",
    objectFit: "cover",
  },
  total: {
    marginTop: "1rem",
    fontWeight: "bold",
  },
  deleteIcon: {
    marginRight: "13px",
    fontSize: "25px",
    cursor: "pointer",
  },
});

export default function MyModal({
  data,
  handleClose,
  open,
  getlengthShop,
  user,
}) {
  const classes = useStyles();
  const [openCheckoutValidation, setOpenCheckoutValidation] = useState(false);
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("pay_on_delivery");
  const [totalPrice, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
const dispatch=useDispatch()
  const HandlesubmitOrder = () => {
    
      setOpenCheckoutValidation(true);
      handleClose();

  };

  const fetchData = async (id) => {
    try {
      const response = await axios.get(
        "https://www.electrozayn.com/api/get_product/card/"+id
      );
      const productsWithQuantity = response.data.map((product) => ({
        ...product,
        quantity: 1,
      }));
      setProducts(productsWithQuantity);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem('id')

    if (open) {
      fetchData(id);
    }
  }, [open]);
const handelremove=(id)=>{
 const userId=localStorage.getItem("id")
 dispatch(remove_fromcard(id,userId))
fetchData(userId)
}

  useEffect(() => {
    const totalPrice = products.reduce((sum, product) => {
      if (product.Promo_price > 0) {
        return sum + Number(product.Promo_price) * product.quantity;
      } else {
        return sum + Number(product.Origin_price) * product.quantity;
      }
    }, 0);
    setTotal(totalPrice);
  }, [products]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleTotal = () => {
    if (isLoading || products.length === 0) {
      return 0;
    }

    let totalPrice = 0;

    products.forEach((product) => {
      if (product.Promo_price > 0) {
        const productTotal =
          Number(product.Promo_price) * Number(product.quantity);
        totalPrice += productTotal;
      } else {
        const productTotal =
          Number(product.Origin_price) * Number(product.quantity);
        totalPrice += productTotal;
      }
    });

    if (paymentMethod === "pay_on_delivery") {
      totalPrice += 7;
    }

    return totalPrice;
  };

  const incrementQuantity = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decrementQuantity = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const updateQuantityOnServer = (productId, quantity) => {
    axios
      .put(`https://www.electrozayn.com/api/update_quantity/${productId}`, {
        quantity,
      })
      .then((res) => {
        toast.success("Success Validation Order!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleValidation = () => {
    products.forEach((product) => {
      updateQuantityOnServer(product.id, product.quantity);
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{display:"flex",justifyContent:"center",fontFamily: 'Arial, sans-serif'}}>Verification pour votre achat</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <ToastContainer />
            {/* <Typography variant="h6">Checkout</Typography> */}
            {isLoading ? (
              <CircularProgress />
            ) : (
              products.map((product) => (
                <Card key={product.id} className={classes.card}>
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className={classes.image}
                  />
                  <CardContent>
                    <Typography variant="subtitle1">
                      {product.product_name}
                    </Typography>
                    <Typography variant="caption">
                      {product.reference}
                    </Typography>
                    {product.Promo_price > 0 ? (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Promo Price: {product.Promo_price} TND
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Promo Price: {product.Origin_price} TND
                      </Typography>
                    )}
                    <div style={{ display: "flex" }}>
                      <Button onClick={() => incrementQuantity(product.id)}>
                        +
                      </Button>
                      <Typography>{product.quantity}</Typography>
                      <Button onClick={() => decrementQuantity(product.id)}>
                        -
                      </Button>
                    </div>
                    {product.Promo_price > 0 ? (
                      <Typography variant="body2" color="black" component="h3">
                        Total:{" "}
                        {Number(product.Promo_price) * Number(product.quantity)}{" "}
                        TND
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="black" component="h3">
                        Total:{" "}
                        {Number(product.Origin_price) *
                          Number(product.quantity)}{" "}
                        TND
                      </Typography>
                    )}
                  </CardContent>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      color: "red",
                    }}
                  >
                    <TiDelete
                      className={classes.deleteIcon}
                      onClick={() => handelremove(product.id)}
                    />
                  </div>
                </Card>
              ))
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={paymentMethod === "pay_on_delivery"}
                  onChange={handlePaymentMethodChange}
                  value="pay_on_delivery"
                />
              }
              label="Pay on Delivery"
            />
          
            <Typography variant="h6" className={classes.total}>
              Total Price: {handleTotal()} TND
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={() => HandlesubmitOrder(true)} color="primary">
            Validate Order
          </Button>
        </DialogActions>
      </Dialog>
      <CheckoutValidation
        open={openCheckoutValidation}
        handleClose={() => setOpenCheckoutValidation(false)}
        totalPrice={handleTotal()}
        products={products}
        handleValidation={handleValidation}
        user={user}
      />
    </div>
  );
}
