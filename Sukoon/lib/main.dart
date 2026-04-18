import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'dart:ui';
import 'package:flutter/services.dart';

void main() {
  print("App starting...");
  runApp(const SukoonApp());
}

// Localization Helper
class L10n {
  static Map<String, dynamic> _data = {};
  static String currLang = "AR"; // Primary is Arabic

  static Future<void> load() async {
    print("Loading localization...");
    try {
      final json = await rootBundle.loadString('assets/localization.json');
      _data = jsonDecode(json);
      print("Localization loaded successfully.");
    } catch (e) {
      print("Error loading localization: $e");
    }
  }

  static String t(String key) {
    return _data[currLang]?[key] ?? _data["EN"]?[key] ?? key;
  }
}

class SukoonApp extends StatefulWidget {
  const SukoonApp({super.key});

  @override
  State<SukoonApp> createState() => _SukoonAppState();
}

class _SukoonAppState extends State<SukoonApp> {
  bool isDark = false;
  bool isLoaded = false;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    print("Initializing app state...");
    await L10n.load();
    print("L10n.load() finished.");
    setState(() {
       isLoaded = true;
       print("isLoaded set to true");
    });
  }

  void toggleTheme() => setState(() => isDark = !isDark);

  void _precacheImages(BuildContext context) {
    precacheImage(const AssetImage(kLogoAsset), context);
    precacheImage(NetworkImage(kLightMarble), context);
    precacheImage(NetworkImage(kDarkMarble), context);
    for (var item in kAmenities) {
      precacheImage(NetworkImage(item['img']!), context);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!isLoaded) return const MaterialApp(home: Scaffold());

    return MaterialApp(
      title: 'Sukoon',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: isDark ? Brightness.dark : Brightness.light,
        scaffoldBackgroundColor: isDark
            ? const Color(0xFF0F0C08)
            : const Color(0xFFFAF5EE),
      ),
      home: const SplashScreen(),
    );
  }
}

// Global Logic Constants
const int TOTAL_BAYS = 10;
const Color kGold = Color(0xFFC5A059);
const String kLightMarble =
    "https://images.unsplash.com/photo-1630756377422-7cfae60dd550?q=80&w=1080";
const String kDarkMarble =
    "https://images.unsplash.com/photo-1582035100994-9ddfc34b1dae?q=80&w=1080";
const String kLogoAsset = "assets/logo.jpeg";
const String kBaseUrl = "http://192.168.100.2:3000/api";

// Amenities Loop Assets
const List<Map<String, String>> kAmenities = [
  {
    "name": "Masjid",
    "ar": "المسجد",
    "img":
        "https://images.unsplash.com/photo-1761639935344-e08947c61551?q=80&w=1080",
  },
  {
    "name": "Café",
    "ar": "المقهى",
    "img":
        "https://images.unsplash.com/photo-1696871390892-235fedbb2c92?q=80&w=1080",
  },
  {
    "name": "Restroom",
    "ar": "دورات المياه",
    "img":
        "https://images.unsplash.com/photo-1638799869566-b17fa794c4de?q=80&w=1080",
  },
  {
    "name": "Mechanic",
    "ar": "الميكانيكي",
    "img":
        "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=1080",
  },
  {
    "name": "Supermarket",
    "ar": "السوبر ماركت",
    "img":
        "https://images.unsplash.com/photo-1771703063283-8d7c86fadef6?q=80&w=1080",
  },
];

// --- Shared Components ---

class MarbleBackground extends StatelessWidget {
  final bool isDark;
  final Widget child;
  const MarbleBackground({
    super.key,
    required this.isDark,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final bool effectiveIsDark =
        Theme.of(context).brightness == Brightness.dark;
    return Container(
      color: effectiveIsDark
          ? const Color(0xFF0F0C08)
          : const Color(0xFFFAF5EE),
      child: Stack(
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: BackgroundPatternPainter(isDark: effectiveIsDark),
            ),
          ),
          child,
        ],
      ),
    );
  }
}

class BackgroundPatternPainter extends CustomPainter {
  final bool isDark;
  BackgroundPatternPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = kGold.withOpacity(isDark ? 0.08 : 0.12)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.5;

    // Draw some subtle circular 'nodes' or grid-like dots
    const int gridRows = 12;
    const int gridCols = 8;
    final rowSpace = size.height / gridRows;
    final colSpace = size.width / gridCols;

    for (int i = 1; i < gridRows; i++) {
      for (int j = 1; j < gridCols; j++) {
        final center = Offset(j * colSpace, i * rowSpace);
        // Every few dots, draw a tiny glowing circle
        if ((i + j) % 5 == 0) {
          canvas.drawCircle(
            center,
            1.5,
            Paint()..color = kGold.withOpacity(isDark ? 0.1 : 0.15),
          );
          canvas.drawCircle(center, 4, paint);
        }
      }
    }

    // Add a few very light diagonal lines
    canvas.drawLine(
      Offset(0, size.height * 0.2),
      Offset(size.width * 0.5, 0),
      paint..color = kGold.withOpacity(isDark ? 0.03 : 0.05),
    );
    canvas.drawLine(
      Offset(size.width, size.height * 0.8),
      Offset(size.width * 0.6, size.height),
      paint..color = kGold.withOpacity(isDark ? 0.03 : 0.05),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// --- Navigation State Machine Screens ---

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.findAncestorStateOfType<_SukoonAppState>()?._precacheImages(
        context,
      );
    });
    Timer(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (c, a1, a2) => const SelectionScreen(),
            transitionsBuilder: (c, a1, a2, child) =>
                FadeTransition(opacity: a1, child: child),
            transitionDuration: const Duration(milliseconds: 600),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: MarbleBackground(
        isDark: true,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.asset(kLogoAsset, height: 120),
              ),
              const SizedBox(height: 20),
              Text(
                "Sukoon",
                style: GoogleFonts.montserrat(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: kGold,
                  letterSpacing: 4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SelectionScreen extends StatefulWidget {
  const SelectionScreen({super.key});

  @override
  State<SelectionScreen> createState() => _SelectionScreenState();
}

class _SelectionScreenState extends State<SelectionScreen> {
  String? loadingType;
  int availableBays = 10;
  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    _fetchAvailability();
    _refreshTimer = Timer.periodic(const Duration(seconds: 30), (timer) {
      _fetchAvailability();
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchAvailability() async {
    try {
      final response = await http.get(Uri.parse('$kBaseUrl/bays/available'));
      final data = jsonDecode(response.body);
      if (mounted) setState(() => availableBays = data['count']);
    } catch (e) {
      debugPrint("Availability error: $e");
    }
  }

  Future<void> _handleAllocation(String type) async {
    if (loadingType != null) return;
    setState(() => loadingType = type);
    try {
      final response = await http
          .post(
            Uri.parse('$kBaseUrl/sessions/start'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'chargeType': type, 'language': L10n.currLang}),
          )
          .timeout(const Duration(seconds: 4));

      final data = jsonDecode(response.body);
      if (response.statusCode == 201) {
        if (mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (c) => GuidanceScreen(
                bayId: data['session']['bayId'],
                serial: data['session']['serialNumber'],
                estimatedTime: data['session']['estimatedTime'],
                sessionId: data['session']['id'],
              ),
            ),
          );
        }
      } else {
        _showError(L10n.t("stationBusy"));
      }
    } catch (e) {
      // Fallback for demo
      _showError("Backend offline - Demo Fallback Activated");
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (c) => GuidanceScreen(
              bayId: 1,
              serial: "SKN-DEMO",
              estimatedTime: type.contains("Super") ? "0.5h" : "6h",
              sessionId: 0,
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => loadingType = null);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.redAccent),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = context.findAncestorStateOfType<_SukoonAppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: MarbleBackground(
        isDark: isDark,
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: kGold.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: kGold.withOpacity(0.3)),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.ev_station, color: kGold, size: 16),
                          const SizedBox(width: 6),
                          Text(
                            "$availableBays / 10 ${L10n.currLang == 'AR' ? 'متوفر' : 'Available'}",
                            style: GoogleFonts.montserrat(
                              color: kGold,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                        isDark ? Icons.wb_sunny : Icons.nightlight_round,
                        color: kGold,
                      ),
                      onPressed: state?.toggleTheme,
                    ),
                  ],
                ),
              ),
              Image.asset(kLogoAsset, height: 80),
              const SizedBox(height: 10),
              Text(
                L10n.t("welcome"),
                style: GoogleFonts.cairo(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: kGold,
                ),
              ),
              const Spacer(),
              _buildOption(
                L10n.t("superCharge"),
                "DC Superfast (1 min)",
                Icons.bolt,
              ),
              const Spacer(),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOption(String title, String sub, IconData icon) {
    final isThisLoading = loadingType == title;
    return GestureDetector(
      onTap: loadingType != null ? null : () => _handleAllocation(title),
      child: Opacity(
        opacity: (loadingType != null && !isThisLoading) ? 0.5 : 1.0,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: kGold.withOpacity(0.5)),
            color: kGold.withOpacity(0.1),
          ),
          child: Row(
            children: [
              Icon(icon, color: kGold, size: 32),
              const SizedBox(width: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.cairo(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: kGold,
                    ),
                  ),
                  Text(
                    sub,
                    style: GoogleFonts.montserrat(
                      fontSize: 12,
                      color: kGold.withOpacity(0.6),
                    ),
                  ),
                ],
              ),
              const Spacer(),
              if (isThisLoading)
                const CircularProgressIndicator(color: kGold, strokeWidth: 2),
            ],
          ),
        ),
      ),
    );
  }
}

class GuidanceScreen extends StatefulWidget {
  final int bayId;
  final String serial;
  final String estimatedTime;
  final int sessionId;

  const GuidanceScreen({
    super.key,
    required this.bayId,
    required this.serial,
    required this.estimatedTime,
    required this.sessionId,
  });

  @override
  State<GuidanceScreen> createState() => _GuidanceScreenState();
}

class _GuidanceScreenState extends State<GuidanceScreen>
    with WidgetsBindingObserver {
  Timer? _idleTimer;
  Timer? _chargeUpdateTimer;
  int _idleSecondsLeft = 10;
  int _chargeSecondsRemain = 0;
  bool _isPaused = false;
  bool _showNotif = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);

    // Calculate initial charge time (Defaulting to 1m for Superfast)
    _chargeSecondsRemain = 60;

    _startIdleTimer();
    _startChargeCountdown();

    Future.delayed(
      const Duration(milliseconds: 1500),
      () => setState(() => _showNotif = true),
    );
  }

  void _resetIdleTimer() {
    if (mounted) {
      setState(() => _idleSecondsLeft = 10);
      _startIdleTimer();
    }
  }

  void _startIdleTimer() {
    _idleTimer?.cancel();
    _idleTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!_isPaused && mounted) {
        setState(() {
          if (_idleSecondsLeft > 0) {
            _idleSecondsLeft--;
          } else {
            _idleTimer?.cancel();
            _navigateToAmenities();
          }
        });
      }
    });
  }

  void _startChargeCountdown() {
    _chargeUpdateTimer?.cancel();
    _chargeUpdateTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!_isPaused && mounted) {
        setState(() {
          if (_chargeSecondsRemain > 0) {
            _chargeSecondsRemain--;
          } else {
            _chargeUpdateTimer?.cancel();
            _handleAutoCompletion();
          }
        });
      }
    });
  }

  void _handleAutoCompletion() {
    // End session automatically
    http.post(Uri.parse('$kBaseUrl/sessions/${widget.sessionId}/complete'));

    // Navigate to completion screen, removing any amenities loop screens on top
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (c) => const CompletionScreen()),
      (route) => route.isFirst,
    );
  }

  void _navigateToAmenities() {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (c, a1, a2) =>
            AmenitiesLoopScreen(sessionId: widget.sessionId),
        transitionsBuilder: (c, a1, a2, child) =>
            FadeTransition(opacity: a1, child: child),
        transitionDuration: const Duration(milliseconds: 500),
      ),
    ).then((_) => _resetIdleTimer());
  }

  String _formatTime(int totalSeconds) {
    int m = totalSeconds ~/ 60;
    int s = totalSeconds % 60;
    return "$m:${s.toString().padLeft(2, '0')}";
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) _isPaused = true;
    if (state == AppLifecycleState.resumed) _isPaused = false;
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _idleTimer?.cancel();
    _chargeUpdateTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _resetIdleTimer,
        child: MarbleBackground(
          isDark: isDark,
          child: Stack(
            children: [
              SafeArea(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "وجهتك تضيء لك",
                        style: GoogleFonts.cairo(
                          fontSize: 27,
                          fontWeight: FontWeight.bold,
                          color: kGold,
                        ),
                      ),
                      Text(
                        "Your path shines for you",
                        style: GoogleFonts.montserrat(
                          fontSize: 14,
                          color: kGold.withOpacity(0.75),
                        ),
                      ),
                      const SizedBox(height: 40),
                      // NEW Progress Counter
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 40,
                          vertical: 20,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          color: kGold.withOpacity(0.1),
                          border: Border.all(color: kGold.withOpacity(0.2)),
                        ),
                        child: Text(
                          _formatTime(_chargeSecondsRemain),
                          style: GoogleFonts.montserrat(
                            fontSize: 72,
                            fontWeight: FontWeight.w200,
                            letterSpacing: -2,
                            color: kGold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 40),
                      _infoBox("M موقف رقم / Bay", widget.bayId.toString()),
                      const SizedBox(height: 20),
                      _infoBox("رقم تسلسلي / Serial", widget.serial),
                      const SizedBox(height: 20),
                      Text(
                        L10n.t("exploreAmenities") + " ($_idleSecondsLeft)",
                        style: GoogleFonts.montserrat(
                          fontSize: 10,
                          color: kGold.withOpacity(0.4),
                        ),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          // Manual termination
                          http.post(
                            Uri.parse(
                              '$kBaseUrl/sessions/${widget.sessionId}/complete',
                            ),
                          );
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (c) => const CompletionScreen(),
                            ),
                          );
                        },
                        child: Text(L10n.t("chargeComplete")),
                      ),
                    ],
                  ),
                ),
              ),
              if (_showNotif) _notification(isDark),
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoBox(String label, String val) {
    return Container(
      width: 300,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        border: Border.all(color: kGold.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(24),
        color: kGold.withOpacity(0.05),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: GoogleFonts.cairo(
              fontSize: 14,
              color: kGold.withOpacity(0.6),
            ),
          ),
          Text(
            val,
            style: GoogleFonts.montserrat(
              fontSize: 48,
              fontWeight: FontWeight.w800,
              color: kGold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _notification(bool isDark) {
    return Positioned(
      top: 60,
      left: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: (isDark ? Colors.black : Colors.white).withOpacity(0.95),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: kGold.withOpacity(0.5)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "أهلاً بك، شاحنك رقم ${widget.bayId} وبرقم تسلسلي ${widget.serial} يضيء لك",
              style: GoogleFonts.cairo(
                fontSize: 12,
                color: kGold,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
              textDirection: TextDirection.rtl,
            ),
            const SizedBox(height: 4),
            Text(
              "Welcome, your charger Bay ${widget.bayId} with serial number ${widget.serial} shines for you.",
              style: GoogleFonts.montserrat(fontSize: 11, color: kGold),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class AmenitiesLoopScreen extends StatefulWidget {
  final int sessionId;
  const AmenitiesLoopScreen({super.key, required this.sessionId});

  @override
  State<AmenitiesLoopScreen> createState() => _AmenitiesLoopScreenState();
}

class _AmenitiesLoopScreenState extends State<AmenitiesLoopScreen> {
  int _currIndex = 0;
  Timer? _loopTimer;

  @override
  void initState() {
    super.initState();
    _startLoop();
  }

  void _startLoop() {
    _loopTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (mounted) {
        setState(() => _currIndex = (_currIndex + 1) % kAmenities.length);
      }
    });
  }

  @override
  void dispose() {
    _loopTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final item = kAmenities[_currIndex];
    return Scaffold(
      backgroundColor: Colors.black,
      body: GestureDetector(
        onTap: () => Navigator.pop(context),
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 800),
          layoutBuilder: (Widget? currentChild, List<Widget> previousChildren) {
            return Stack(
              alignment: Alignment.center,
              children: <Widget>[
                ...previousChildren,
                if (currentChild != null) currentChild,
              ],
            );
          },
          child: Container(
            key: ValueKey(_currIndex),
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(item['img']!),
                fit: BoxFit.cover,
              ),
            ),
            child: Stack(
              children: [
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [Colors.black87, Colors.transparent],
                    ),
                  ),
                ),
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        item['ar']!,
                        style: GoogleFonts.cairo(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        item['name']!,
                        style: GoogleFonts.montserrat(
                          fontSize: 24,
                          color: Colors.white70,
                        ),
                      ),
                      const SizedBox(height: 80),
                      const Text(
                        "Tap anywhere to return",
                        style: TextStyle(color: Colors.white54),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class CompletionScreen extends StatelessWidget {
  const CompletionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      body: MarbleBackground(
        isDark: isDark,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.check_circle_outline, color: kGold, size: 100),
              const SizedBox(height: 20),
              Text(
                "شحنت... وتجددت, \nشحنت سيارتك بالكامل … نتمنى أن تكون قد استعدت سكونك. \nنراك قريبًا",
                textAlign: TextAlign.center,
                style: GoogleFonts.cairo(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: kGold,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                "Charged... and Renewed. \nYour car is fully charged. \nWe hope you have found your peace, see you soon.",
                textAlign: TextAlign.center,
                style: GoogleFonts.montserrat(
                  fontSize: 18,
                  color: kGold.withOpacity(0.7),
                ),
              ),
              const SizedBox(height: 60),
              ElevatedButton(
                onPressed: () => Navigator.popUntil(context, (r) => r.isFirst),
                child: Text(L10n.t("backHome")),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
