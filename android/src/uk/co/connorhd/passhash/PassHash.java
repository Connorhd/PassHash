package uk.co.connorhd.passhash;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;

public class PassHash extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView webview = new WebView(this);
        webview.getSettings().setJavaScriptEnabled(true);
        setContentView(webview);
        webview.loadUrl("file:///android_asset/pass.html");
    }
}