package com.lzp.util;


import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.AsyncHttpClient.BoundRequestBuilder;
import com.ning.http.client.Response;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class WechatHttpKit
{
    private static final String DEFAULT_CHARSET = "UTF-8";

    public static String get(String url, Map<String, String> params, Map<String, String> headers)
            throws IOException, ExecutionException, InterruptedException
    {
        AsyncHttpClient http = new AsyncHttpClient();
        AsyncHttpClient.BoundRequestBuilder builder = http.prepareGet(url);
        builder.setBodyEncoding("UTF-8");
        if ((params != null) && (!params.isEmpty()))
        {
            Set<String> keys = params.keySet();
            for (String key : keys) {
                builder.addFormParam(key, (String)params.get(key));
            }
        }
        if ((headers != null) && (!headers.isEmpty()))
        {
            Set<String> keys = headers.keySet();
            for (String key : keys) {
                builder.addHeader(key, (String)params.get(key));
            }
        }
        Future<Response> f = builder.execute();
        String body = ((Response)f.get()).getResponseBody("UTF-8");
        http.close();
        return body;
    }

    public static String get(String url)
            throws KeyManagementException, NoSuchAlgorithmException, NoSuchProviderException, UnsupportedEncodingException, IOException, ExecutionException, InterruptedException
    {
        return get(url, null);
    }

    public static String get(String url, Map<String, String> params)
            throws KeyManagementException, NoSuchAlgorithmException, NoSuchProviderException, UnsupportedEncodingException, IOException, ExecutionException, InterruptedException
    {
        return get(url, params, null);
    }

    public static String post(String url, Map<String, String> params)
            throws IOException, ExecutionException, InterruptedException
    {
        AsyncHttpClient http = new AsyncHttpClient();
        AsyncHttpClient.BoundRequestBuilder builder = http.preparePost(url);
        builder.setBodyEncoding("UTF-8");
        if ((params != null) && (!params.isEmpty()))
        {
            Set<String> keys = params.keySet();
            for (String key : keys) {
                builder.addFormParam(key, (String)params.get(key));
            }
        }
        Future<Response> f = builder.execute();
        String body = ((Response)f.get()).getResponseBody("UTF-8");
        http.close();
        return body;
    }

    public static String post(String url, String s)
            throws IOException, ExecutionException, InterruptedException
    {
        AsyncHttpClient http = new AsyncHttpClient();
        AsyncHttpClient.BoundRequestBuilder builder = http.preparePost(url);
        builder.setBodyEncoding("UTF-8");
        builder.setBody(s);
        Future<Response> f = builder.execute();
        String body = ((Response)f.get()).getResponseBody("UTF-8");
        http.close();
        return body;
    }
}
