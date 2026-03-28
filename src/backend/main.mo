import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type Sneaker = {
    id : Nat;
    name : Text;
    brand : Text;
    price : Nat;
    description : Text;
    category : Text;
    sizes : [Text];
    imageUrl : Text;
    isActive : Bool;
  };

  module Sneaker {
    public func compare(sneaker1 : Sneaker, sneaker2 : Sneaker) : Order.Order {
      Text.compare(sneaker1.name, sneaker2.name);
    };
  };

  type OrderItem = {
    sneakerId : Nat;
    size : Text;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    user : Principal;
    items : [OrderItem];
    totalPrice : Nat;
    status : Text;
    timestamp : Time.Time;
  };

  module OrderModule {
    public func compare(order1 : Order, order2 : Order) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let sneakers = Map.empty<Nat, Sneaker>();
  let orders = Map.empty<Nat, Order>();
  var nextSneakerId = 0;
  var nextOrderId = 0;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Sneaker Management Functions
  public shared ({ caller }) func createSneaker(sneaker : Sneaker) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create sneakers");
    };
    let id = nextSneakerId;
    let newSneaker = {
      sneaker with
      id;
      isActive = true;
    };
    sneakers.add(id, newSneaker);
    nextSneakerId += 1;
    id;
  };

  public query func getSneaker(id : Nat) : async Sneaker {
    switch (sneakers.get(id)) {
      case (null) { Runtime.trap("Sneaker not found") };
      case (?sneaker) { sneaker };
    };
  };

  public query func getAllSneakers() : async [Sneaker] {
    sneakers.values().toArray().sort();
  };

  public shared ({ caller }) func updateSneaker(sneaker : Sneaker) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update sneakers");
    };
    if (not sneakers.containsKey(sneaker.id)) {
      Runtime.trap("Sneaker not found");
    };
    sneakers.add(sneaker.id, sneaker);
  };

  public shared ({ caller }) func deleteSneaker(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete sneakers");
    };
    if (not sneakers.containsKey(id)) {
      Runtime.trap("Sneaker not found");
    };
    sneakers.remove(id);
  };

  // Order Management Functions
  public shared ({ caller }) func placeOrder(items : [OrderItem], totalPrice : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let id = nextOrderId;
    let newOrder = {
      id;
      user = caller;
      items;
      totalPrice;
      status = "pending";
      timestamp = Time.now();
    };
    orders.add(id, newOrder);
    nextOrderId += 1;
    id;
  };

  public query ({ caller }) func getOrder(id : Nat) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.user != caller and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
          Runtime.trap("Unauthorized: Only the owner or admin can view this order");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    let myOrders = orders.values().toList<Order>().filter(func(o) { o.user == caller });
    myOrders.toArray().sort();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          order with
          status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };
};
