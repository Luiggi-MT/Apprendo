import { Menu } from "./Menu";

export interface ApiResponseMenu{
    ok: boolean;
    menus?: Menu[];
    offset: number;
    count: number;
    menu?: Menu;
}