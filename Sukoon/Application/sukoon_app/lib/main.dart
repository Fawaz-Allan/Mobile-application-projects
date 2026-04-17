import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sukoon App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
      if (!mounted) return;
      Navigator.of(
        context,
      ).pushReplacement(MaterialPageRoute(builder: (_) => const HomeScreen()));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Image.asset(
          'assets/images/splash.jpeg',
          fit: BoxFit.fill,
          width: double.infinity,
          height: double.infinity,
        ),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/images/home.jpeg',
            // Using fill maps the image perfectly onto the screen bounds,
            // so we don't lose interactions off-screen due to aspect-ratio cropping.
            fit: BoxFit.fill,
          ),
          Column(
            children: [
              Expanded(
                flex: 1,
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    splashColor:
                        Colors.black26, // gives visual feedback over image
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) =>
                              const ChargingScreen(isFastCharge: true),
                        ),
                      );
                    },
                  ),
                ),
              ),
              Expanded(
                flex: 1,
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    splashColor:
                        Colors.black26, // gives visual feedback over image
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) =>
                              const ChargingScreen(isFastCharge: false),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class ChargingScreen extends StatefulWidget {
  final bool isFastCharge;

  const ChargingScreen({super.key, required this.isFastCharge});

  @override
  State<ChargingScreen> createState() => _ChargingScreenState();
}

class _ChargingScreenState extends State<ChargingScreen> {
  bool isWaiting = false;
  int cycleCount = 0;
  final int maxCycles = 2;
  bool _showCustomNotification = false;

  @override
  void initState() {
    super.initState();
    _startTimer();

    // Trigger the custom on-screen notification instead of bottom SnackBar
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        setState(() {
          _showCustomNotification = true;
        });
      }

      // Auto-hide the notification after 4 seconds
      Future.delayed(const Duration(seconds: 4), () {
        if (mounted) {
          setState(() {
            _showCustomNotification = false;
          });
        }
      });
    });
  }

  void _startTimer() {
    if (cycleCount >= maxCycles) {
      if (!mounted) return;
      Navigator.of(
        context,
      ).pushReplacement(MaterialPageRoute(builder: (_) => const FinalScreen()));
      return;
    }

    if (isWaiting) {
      // Waiting screen for 5 seconds
      Future.delayed(const Duration(seconds: 5), () {
        if (!mounted) return;
        setState(() {
          isWaiting = false;
          cycleCount++;
        });
        _startTimer();
      });
    } else {
      // Charging screen for 7.5 seconds
      Future.delayed(const Duration(milliseconds: 7500), () {
        if (!mounted) return;
        setState(() {
          isWaiting = true;
        });
        _startTimer();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    String currentImage;
    if (isWaiting) {
      currentImage = 'assets/images/Waiting.jpeg';
    } else {
      currentImage = widget.isFastCharge
          ? 'assets/images/Fast charge.jpeg'
          : 'assets/images/Eco mode.jpeg';
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: GestureDetector(
        onTap: () {
          // Tapping early will finish the process
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const FinalScreen()),
          );
        },
        child: Stack(
          fit: StackFit.expand,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 800),
              child: Image.asset(
                currentImage,
                key: ValueKey<String>(currentImage),
                fit: BoxFit.fill,
                width: double.infinity,
                height: double.infinity,
              ),
            ),
            // Integrated Notification in the specific section covering the old text
            if (_showCustomNotification && !isWaiting)
              Positioned(
                top:
                    MediaQuery.of(context).size.height *
                    0.1, // Positioning over the baked-in text
                left: MediaQuery.of(context).size.width * 0.05,
                right: MediaQuery.of(context).size.width * 0.05,
                child: AnimatedOpacity(
                  opacity: _showCustomNotification ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 500),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 24,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(
                        0.95,
                      ), // Solid enough to completely hide the physical text
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Text(
                      widget.isFastCharge
                          ? '"أهلاً بك، شاحنك.\nرقم --برقم تسلسلي 2222\nيضيء لك الآن."'
                          : '"أهلاً بك، شاحنك.\nرقم -1-ورقم تسلسلي 1111\nيضيء لك الآن."',
                      textAlign: TextAlign.center,
                      textDirection: TextDirection.rtl,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                        height: 1.5,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class FinalScreen extends StatelessWidget {
  const FinalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: GestureDetector(
        onTap: () {
          // Tapping on final screen takes back to home
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const HomeScreen()),
            (route) => false,
          );
        },
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(
              'assets/images/Final.jpeg',
              fit: BoxFit.fill,
              width: double.infinity,
              height: double.infinity,
            ),
            // Integrated Notification in the specific section covering the old text
            Positioned(
              top:
                  MediaQuery.of(context).size.height *
                  0.1, // Positioning over the baked-in text
              left: MediaQuery.of(context).size.width * 0.05,
              right: MediaQuery.of(context).size.width * 0.05,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  vertical: 24,
                  horizontal: 16,
                ),
                decoration: BoxDecoration(
                  color: const Color.fromRGBO(
                    255,
                    255,
                    255,
                    0.95,
                  ), // Solid enough to completely hide the physical text
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(
                      color: Color.fromRGBO(0, 0, 0, 0.2),
                      blurRadius: 10,
                      offset: Offset(0, 5),
                    ),
                  ],
                ),
                child: const Text(
                  'انتهت عملية الشحن',
                  textAlign: TextAlign.center,
                  textDirection: TextDirection.rtl,
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                    height: 1.5,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
