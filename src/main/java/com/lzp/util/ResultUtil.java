package com.lzp.util;

public class ResultUtil {


    public static Result success(Object object) {
        Result result = new Result();
        result.setCode(0);
        result.setMsg("成功");
        result.setData(object);
        return result;
    }


    public static Result success() {
        return success(null);
    }

    public static Result error(Object object) {
        Result result = new Result();
        result.setCode(-1);
        result.setMsg("失败");
        result.setData(object);

        return result;
    }

    public static Result error() {
        return error(null);
    }

}