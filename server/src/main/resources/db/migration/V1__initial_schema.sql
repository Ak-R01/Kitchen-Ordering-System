-- V1: Initial schema
CREATE TABLE restaurant_tables (
                                   id            BIGSERIAL PRIMARY KEY,
                                   table_number  VARCHAR(255) NOT NULL UNIQUE,
                                   public_token  VARCHAR(255) NOT NULL UNIQUE,
                                   created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE categories (
                            id    BIGSERIAL PRIMARY KEY,
                            name  VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE menu_items (
                            id           BIGSERIAL PRIMARY KEY,
                            category_id  BIGINT NOT NULL REFERENCES categories(id),
                            name         VARCHAR(255) NOT NULL,
                            price        NUMERIC(10, 2) NOT NULL,
                            description  VARCHAR(1000),
                            image_url    VARCHAR(255),
                            available    BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);

CREATE TABLE orders (
                        id          BIGSERIAL PRIMARY KEY,
                        table_id    BIGINT NOT NULL REFERENCES restaurant_tables(id),
                        status      VARCHAR(20) NOT NULL,
                        created_at  TIMESTAMP NOT NULL DEFAULT now(),
                        updated_at  TIMESTAMP
);

CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE TABLE order_items (
                             id                          BIGSERIAL PRIMARY KEY,
                             order_id                    BIGINT NOT NULL REFERENCES orders(id),
                             menu_item_id                BIGINT NOT NULL REFERENCES menu_items(id),
                             quantity                    INTEGER NOT NULL,
                             notes                       VARCHAR(500),
                             item_name_at_order_time     VARCHAR(255) NOT NULL,
                             unit_price_at_order_time    NUMERIC(10, 2) NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

CREATE TABLE staff (
                       id             BIGSERIAL PRIMARY KEY,
                       name           VARCHAR(255) NOT NULL,
                       username       VARCHAR(255) NOT NULL UNIQUE,
                       password_hash  VARCHAR(255) NOT NULL,
                       role           VARCHAR(20) NOT NULL
);