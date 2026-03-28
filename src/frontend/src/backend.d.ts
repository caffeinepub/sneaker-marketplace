import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Sneaker {
    id: bigint;
    name: string;
    description: string;
    isActive: boolean;
    sizes: Array<string>;
    imageUrl: string;
    category: string;
    brand: string;
    price: bigint;
}
export interface Order {
    id: bigint;
    status: string;
    user: Principal;
    timestamp: Time;
    items: Array<OrderItem>;
    totalPrice: bigint;
}
export interface UserProfile {
    name: string;
}
export interface OrderItem {
    size: string;
    sneakerId: bigint;
    quantity: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSneaker(sneaker: Sneaker): Promise<bigint>;
    deleteSneaker(id: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllSneakers(): Promise<Array<Sneaker>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(id: bigint): Promise<Order>;
    getSneaker(id: bigint): Promise<Sneaker>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<OrderItem>, totalPrice: bigint): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updateSneaker(sneaker: Sneaker): Promise<void>;
}
